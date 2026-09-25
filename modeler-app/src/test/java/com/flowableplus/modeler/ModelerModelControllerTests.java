package com.flowableplus.modeler;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flowableplus.modeler.model.ModelProjectEntity;
import com.flowableplus.modeler.model.ModelProjectService;
import com.flowableplus.modeler.model.ModelVersionEntity;
import com.flowableplus.modeler.model.ModelVersionService;
import com.flowableplus.modeler.security.LocalTokenService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@SpringBootTest
@WebAppConfiguration
class ModelerModelControllerTests {

    @Autowired
    private WebApplicationContext applicationContext;

    @Autowired
    private FilterChainProxy securityFilterChain;

    private MockMvc mockMvc;

    @Autowired
    private LocalTokenService tokenService;

    @Autowired
    private ModelProjectService projectService;

    @Autowired
    private ModelVersionService versionService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(applicationContext)
                .addFilters(securityFilterChain)
                .build();
    }

    @Test
    void modelerRequestsRequireBearerCredentials() throws Exception {
        mockMvc.perform(get("/api/modeler/projects").param("clientId", "client-local"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void authorizedUsersCanCreateAClientScopedProject() throws Exception {
        mockMvc.perform(post("/api/modeler/projects")
                        .param("clientId", "client-local")
                        .header("Authorization", bearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"modelKey\":\"created-http\",\"modelType\":\"CMMN\",\"displayName\":\"Created project\",\"ownerId\":\"modeler\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.modelKey").value("created-http"))
                .andExpect(jsonPath("$.modelType").value("CMMN"))
                .andExpect(jsonPath("$.lifecycleState").value("DRAFT"));
    }

    @Test
    void clientIsolationDoesNotExposeProjects() throws Exception {
        ModelProjectEntity project = projectService.create("client-local", "isolated-http", com.flowableplus.contracts.ModelType.BPMN, "Local project", "modeler");

        mockMvc.perform(get("/api/modeler/projects/{projectId}/versions", project.getId())
                        .param("clientId", "client-other")
                        .header("Authorization", bearerToken()))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("The requested model is not available."));
    }

    @Test
    void draftUpdatesThroughTheProtectedEndpoint() throws Exception {
        ModelProjectEntity project = projectService.create("client-local", "draft-http", com.flowableplus.contracts.ModelType.BPMN, "Draft project", "modeler");
        ModelVersionEntity version = versionService.saveDraft("client-local", project.getId(), "<bpmn>one</bpmn>");

        mockMvc.perform(put("/api/modeler/versions/{versionId}", version.getId())
                        .param("clientId", "client-local")
                        .header("Authorization", bearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(java.util.Map.of("xml", "<bpmn>two</bpmn>"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.xml").value("<bpmn>two</bpmn>"));
    }

    @Test
    void publishedVersionMutationReturnsSafeConflict() throws Exception {
        ModelProjectEntity project = projectService.create("client-local", "published-http", com.flowableplus.contracts.ModelType.BPMN, "Published project", "modeler");
        ModelVersionEntity version = versionService.saveDraft("client-local", project.getId(), "<bpmn>published</bpmn>");
        versionService.publish("client-local", version.getId());

        mockMvc.perform(put("/api/modeler/versions/{versionId}", version.getId())
                        .param("clientId", "client-local")
                        .header("Authorization", bearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(java.util.Map.of("xml", "<bpmn>changed</bpmn>"))))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Published model versions are immutable; create a draft first."));
    }

    private String bearerToken() {
        return "Bearer " + tokenService.issue("modeler", "local-password").accessToken();
    }
}