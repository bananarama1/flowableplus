package com.flowableplus.modeler;

import static org.assertj.core.api.Assertions.assertThat;

import com.flowableplus.modeler.publication.PublicationRecordEntity;
import com.flowableplus.modeler.publication.PublicationRecordService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class PublicationRecordServiceTests {

    @Autowired
    private PublicationRecordService service;

    @Test
    void failedPublicationLeavesPreviousActiveVersionUnchanged() {
        PublicationRecordEntity active = service.recordActive(
                "client-publication", "leave", "version-1", "owner", "deployment-1", "correlation-1");
        service.recordFailure(
                "client-publication", "leave", "version-2", "owner", "unsupported gateway", "correlation-2");

        PublicationRecordEntity stillActive = service.active("client-publication", "leave");
        assertThat(stillActive.getId()).isEqualTo(active.getId());
        assertThat(stillActive.getVersionId()).isEqualTo("version-1");
        assertThat(stillActive.isActive()).isTrue();
    }
}