package com.flowableplus.modeler.publication;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.jsonPath;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import com.flowableplus.contracts.ModelType;
import com.flowableplus.contracts.PublicationResult;
import com.flowableplus.contracts.PublicationStatus;
import com.flowableplus.modeler.model.ModelProjectEntity;
import com.flowableplus.modeler.model.ModelVersionEntity;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;

class ModelerPublicationClientTests {

    @Test
    void publishesClientScopedVersionWithSharedHeadersAndBearerToken() {
                RestClient.Builder restClientBuilder = RestClient.builder();
                MockRestServiceServer server = MockRestServiceServer.bindTo(restClientBuilder).build();
                RestClient restClient = restClientBuilder.build();
        ModelerPublicationClient client = new ModelerPublicationClient(restClient, "http://work-app");
        ModelProjectEntity project = new ModelProjectEntity(
                "client-a", "leave-request", ModelType.BPMN, "Leave request", "modeler");
        ModelVersionEntity version = new ModelVersionEntity(
                "client-a", project.getId(), 3,
                "<definitions><process id=\"leave-request\"/></definitions>");

        server.expect(requestTo("http://work-app/api/publications"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("Authorization", "Bearer work-token"))
                .andExpect(header("X-FlowablePlus-Api-Version", "1"))
                .andExpect(header("X-Correlation-Id", "correlation-1"))
                .andExpect(header("Idempotency-Key", "client-a:leave-request:3"))
                .andExpect(jsonPath("$.model.clientScope.clientId").value("client-a"))
                .andExpect(jsonPath("$.model.modelKey").value("leave-request"))
                .andExpect(jsonPath("$.version.version").value(3))
                .andExpect(jsonPath("$.version.state").value("PUBLISHED"))
                .andExpect(jsonPath("$.document.xml").value(version.getXml()))
                .andExpect(jsonPath("$.actorId").value("modeler"))
                .andRespond(withSuccess(
                        "{\"status\":\"ACTIVE\",\"correlationId\":\"correlation-1\",\"runtimeReference\":\"deployment-1\"}",
                        MediaType.APPLICATION_JSON));

        assertThat(client.publish(project, version, null, "modeler", "correlation-1", "Bearer work-token"))
                .extracting(result -> result.status(), result -> result.runtimeReference())
                .containsExactly(PublicationStatus.ACTIVE, "deployment-1");
        server.verify();
    }

    @Test
    void returnsFailedResultWhenPublicationRequestCannotReachWorkApp() {
        RestClient.Builder restClientBuilder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(restClientBuilder).build();
        RestClient restClient = restClientBuilder.build();
        ModelerPublicationClient client = new ModelerPublicationClient(restClient, "http://work-app");
        ModelProjectEntity project = new ModelProjectEntity(
                "client-a", "leave-request", ModelType.BPMN, "Leave request", "modeler");
        ModelVersionEntity version = new ModelVersionEntity(
                "client-a", project.getId(), 4,
                "<definitions><process id=\"leave-request\"/></definitions>");

        server.expect(requestTo("http://work-app/api/publications"))
                .andExpect(method(HttpMethod.POST))
                .andRespond(request -> {
                    throw new ResourceAccessException("Connection timed out while contacting work app");
                });

        assertThat(client.publish(project, version, null, "modeler", "correlation-2", "Bearer work-token"))
                .extracting(PublicationResult::status, PublicationResult::correlationId, PublicationResult::runtimeReference, PublicationResult::failureMessage)
                .containsExactly(PublicationStatus.FAILED, "correlation-2", null, "The publication request timed out or could not be delivered to the work app.");
        server.verify();
    }
}