package com.flowableplus.work.modeler;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("flowableplus.modeler")
public class FlowablePlusModelerProperties {

	private boolean enabled;
	private Path root = Paths.get("flowable-models");
	private boolean localOnly = true;
	private long watchDebounceMillis = 150;
	private List<String> extensions = new ArrayList<>(List.of(".bpmn", ".bpmn20.xml", ".cmmn", ".dmn"));

	public boolean isEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public Path getRoot() {
		return root;
	}

	public void setRoot(Path root) {
		this.root = root;
	}

	public boolean isLocalOnly() {
		return localOnly;
	}

	public void setLocalOnly(boolean localOnly) {
		this.localOnly = localOnly;
	}

	public long getWatchDebounceMillis() {
		return watchDebounceMillis;
	}

	public void setWatchDebounceMillis(long watchDebounceMillis) {
		this.watchDebounceMillis = watchDebounceMillis;
	}

	public List<String> getExtensions() {
		return extensions;
	}

	public void setExtensions(List<String> extensions) {
		this.extensions = extensions;
	}
}