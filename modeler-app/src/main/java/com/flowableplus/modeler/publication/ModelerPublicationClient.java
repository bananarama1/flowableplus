package com.flowableplus.modeler.publication;

import com.flowableplus.contracts.ClientScope;
import com.flowableplus.contracts.DocumentPayload;
import com.flowableplus.contracts.FormSchema;
import com.flowableplus.contracts.ModelIdentity;
import com.flowableplus.contracts.ModelType;
import com.flowableplus.contracts.ModelVersion;
import com.flowableplus.contracts.PublicationContract;
import com.flowableplus.contracts.PublicationEnvelope;
import com.flowableplus.contracts.PublicationResult;
import com.flowableplus.contracts.VersionState;
import com.flowableplus.modeler.model.ModelProjectEntity;
import com.flowableplus.modeler.model.ModelVersionEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ModelerPublicationClient {

    private final RestClient restClient;
    private final String publicationBaseUrl;

    @Autowired
    public ModelerPublicationClient(
            RestClient.Builder restClientBuilder,
            @Value("${flowableplus.modeler.publication.base-url:http://localhost:8081}") String publicationBaseUrl) {
        this(restClientBuilder.build(), publicationBaseUrl);
    }

    ModelerPublicationClient(RestClient restClient, String publicationBaseUrl) {
        this.restClient = restClient;
        this.publicationBaseUrl = publicationBaseUrl.replaceAll("/$", "");
    }

    public PublicationResult publish(
            ModelProjectEntity project,
            ModelVersionEntity version,
            FormSchema formSchema,
            String actorId,
            String correlationId,
            String bearerToken) {
        String idempotencyKey = project.getClientId() + ":" + project.getModelKey() + ":" + version.getVersionNumber();
        ModelIdentity identity = new ModelIdentity(
                new ClientScope(project.getClientId()), project.getModelKey(), project.getModelType(), project.getDisplayName());
        PublicationEnvelope envelope = new PublicationEnvelope(
                identity,
                new ModelVersion(identity, version.getVersionNumber(), VersionState.PUBLISHED, contentHash(version.getXml())),
                new DocumentPayload(project.getModelType(), fileName(project), version.getXml()),
                formSchema, idempotencyKey, correlationId, actorId);

        return restClient.post()
                .uri(publicationBaseUrl + "/api/publications")
                .header(PublicationContract.API_VERSION_HEADER, PublicationContract.CURRENT_API_VERSION)
                .header(PublicationContract.CORRELATION_ID_HEADER, correlationId)
                .header(PublicationContract.IDEMPOTENCY_KEY_HEADER, idempotencyKey)
                .header("Authorization", bearerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(envelope)
                .retrieve()
                .body(PublicationResult.class);
    }

    private String fileName(ModelProjectEntity project) {
        return project.getModelKey() + (project.getModelType() == ModelType.BPMN ? ".bpmn20.xml" : ".cmmn.xml");
    }

    private String contentHash(String xml) {
        try {
            byte[] digest = java.security.MessageDigest.getInstance("SHA-256")
                    .digest(xml.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            return "sha256:" + java.util.HexFormat.of().formatHex(digest);
        } catch (java.security.NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is required", exception);
        }
    }
}