package com.flowableplus.work.security;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.security.web.FilterChainProxy;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@WebAppConfiguration
class BearerAuthenticationIntegrationTests {

    @Autowired
        private WebApplicationContext applicationContext;

    @Autowired
    private FilterChainProxy securityFilterChain;

    private final ObjectMapper objectMapper = new ObjectMapper();

        private MockMvc mockMvc;

        @org.junit.jupiter.api.BeforeEach
        void setUp() {
            mockMvc = MockMvcBuilders.webAppContextSetup(applicationContext)
                    .addFilters(securityFilterChain)
                    .build();
        }

    @Test
    void healthAndTokenIssuanceArePublic() throws Exception {
        mockMvc.perform(get("/health")).andExpect(status().isOk());
        mockMvc.perform(post("/api/auth/token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"alice\",\"password\":\"local-password\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void protectedRuntimeApiRequiresAndAcceptsBearerToken() throws Exception {
        mockMvc.perform(get("/api/runtime/tasks").param("clientId", "client-local"))
                .andExpect(status().isUnauthorized());

        MvcResult tokenResult = mockMvc.perform(post("/api/auth/token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"alice\",\"password\":\"local-password\"}"))
                .andExpect(status().isOk())
                .andReturn();
        JsonNode token = objectMapper.readTree(tokenResult.getResponse().getContentAsString());

        mockMvc.perform(get("/api/runtime/tasks")
                        .param("clientId", "client-local")
                        .header("Authorization", "Bearer " + token.get("accessToken").asText()))
                .andExpect(status().isOk());
    }

    @Test
    void invalidCredentialsReturnUnauthorized() throws Exception {
        mockMvc.perform(post("/api/auth/token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"alice\",\"password\":\"wrong\"}"))
                .andExpect(status().isUnauthorized());
    }
}