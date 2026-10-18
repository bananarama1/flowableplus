package com.flowableplus.work.autoconfigure;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("flowableplus.testing")
public class FlowablePlusTestingProperties {

	private boolean enabled;
	private boolean skipDefaultDeployment;

	public boolean isEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public boolean isSkipDefaultDeployment() {
		return skipDefaultDeployment;
	}

	public void setSkipDefaultDeployment(boolean skipDefaultDeployment) {
		this.skipDefaultDeployment = skipDefaultDeployment;
	}
}