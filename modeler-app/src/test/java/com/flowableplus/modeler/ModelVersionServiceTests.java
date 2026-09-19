package com.flowableplus.modeler;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.flowableplus.contracts.ModelType;
import com.flowableplus.modeler.model.ModelProjectEntity;
import com.flowableplus.modeler.model.ModelProjectService;
import com.flowableplus.modeler.model.ModelVersionEntity;
import com.flowableplus.modeler.model.ModelVersionService;
import com.flowableplus.modeler.model.PublishedVersionMutationException;
import com.flowableplus.modeler.model.VersionLifecycleState;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ModelVersionServiceTests {

    @Autowired
    private ModelProjectService projectService;

    @Autowired
    private ModelVersionService versionService;

    @Test
    void publishedVersionIsImmutableAndSeedsNewDraft() {
        ModelProjectEntity project = projectService.create("client-version", "leave", ModelType.BPMN, "Leave", "owner");
        ModelVersionEntity draft = versionService.saveDraft("client-version", project.getId(), "<bpmn>one</bpmn>");
        versionService.publish("client-version", draft.getId());

        assertThatThrownBy(() -> versionService.updateDraft("client-version", draft.getId(), "<bpmn>two</bpmn>"))
                .isInstanceOf(PublishedVersionMutationException.class);

        ModelVersionEntity nextDraft = versionService.createDraftFromPublished("client-version", draft.getId());
        assertThat(nextDraft.getState()).isEqualTo(VersionLifecycleState.DRAFT);
        assertThat(nextDraft.getVersionNumber()).isEqualTo(2);
        assertThat(nextDraft.getXml()).isEqualTo("<bpmn>one</bpmn>");
    }
}