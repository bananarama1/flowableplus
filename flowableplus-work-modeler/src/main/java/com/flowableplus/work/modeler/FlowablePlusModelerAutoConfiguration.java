package com.flowableplus.work.modeler;

import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

@AutoConfiguration
@ConditionalOnProperty(prefix = "flowableplus.modeler", name = "enabled", havingValue = "true")
@EnableConfigurationProperties(FlowablePlusModelerProperties.class)
public class FlowablePlusModelerAutoConfiguration {

	@Bean
	ModelerFileService flowablePlusModelerFileService(FlowablePlusModelerProperties properties) {
		return new ModelerFileService(properties);
	}

	@Bean
	FlowablePlusModelerController flowablePlusModelerController(ModelerFileService files,
			FlowablePlusModelerProperties properties) {
		return new FlowablePlusModelerController(files, properties);
	}
}