package com.flowableplus.modeler;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.flowableplus.contracts.ModelType;
import com.flowableplus.modeler.model.ModelProjectEntity;
import com.flowableplus.modeler.model.ModelProjectService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ModelProjectRepositoryTests {

    @Autowired
    private ModelProjectService service;

    @Test
    void authorizedReadsStayWithinClientScope() {
        ModelProjectEntity clientA = service.create("client-a", "same-key", ModelType.BPMN, "Client A", "owner-a");
        service.create("client-b", "same-key", ModelType.BPMN, "Client B", "owner-b");

        assertThat(service.findForClient("client-a"))
                .extracting(ModelProjectEntity::getId)
                .containsExactly(clientA.getId());
        assertThatThrownBy(() -> service.findAuthorized("client-b", clientA.getId()))
                .isInstanceOf(java.util.NoSuchElementException.class);
    }
}