package com.flowableplus.parent;

import org.junit.jupiter.api.Test;
import org.flowable.engine.RuntimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class ParentApplicationTests {

	@Autowired
	private RuntimeService runtimeService;

	@Test
	void contextLoads() {
	}

	@Test
	void startsSimpleProcessInstance() {
		var processInstance = runtimeService.startProcessInstanceByKey("simpleProcess");

		assertThat(processInstance.getProcessDefinitionKey()).isEqualTo("simpleProcess");
	}

}
