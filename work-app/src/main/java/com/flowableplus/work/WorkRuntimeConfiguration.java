package com.flowableplus.work;

import java.util.List;

import com.flowableplus.flowable.adapter.DefaultFlowableRuntimeAdapter;
import com.flowableplus.flowable.adapter.FlowableRuntimeAdapter;
import com.flowableplus.flowable.runtime.ClientRuntimeRegistry;
import com.flowableplus.flowable.runtime.ClientRuntimeTarget;
import com.flowableplus.flowable.runtime.InMemoryClientRuntimeRegistry;
import com.flowableplus.work.publication.RuntimeCompatibilityValidator;
import org.flowable.cmmn.api.CmmnHistoryService;
import org.flowable.cmmn.api.CmmnRepositoryService;
import org.flowable.cmmn.api.CmmnRuntimeService;
import org.flowable.engine.HistoryService;
import org.flowable.engine.RepositoryService;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.TaskService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WorkRuntimeConfiguration {

    @Bean
    RuntimeCompatibilityValidator runtimeCompatibilityValidator() {
        return new RuntimeCompatibilityValidator();
    }

    @Bean
    ClientRuntimeRegistry clientRuntimeRegistry(
            @Value("${flowableplus.work.runtime.client-id:client-local}") String clientId) {
        return new InMemoryClientRuntimeRegistry(List.of(
                new ClientRuntimeTarget(clientId, "runtime-local", "flowable_local", "local")));
    }

    @Bean
    FlowableRuntimeAdapter flowableRuntimeAdapter(
            RepositoryService repositoryService,
            CmmnRepositoryService cmmnRepositoryService,
            RuntimeService runtimeService,
            CmmnRuntimeService cmmnRuntimeService,
            TaskService taskService,
            HistoryService historyService,
            CmmnHistoryService cmmnHistoryService) {
        return new DefaultFlowableRuntimeAdapter(
                repositoryService, cmmnRepositoryService, runtimeService,
                cmmnRuntimeService, taskService, historyService, cmmnHistoryService);
    }
}