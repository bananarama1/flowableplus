package com.flowableplus.modeler.model;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ModelVersionRepository extends JpaRepository<ModelVersionEntity, String> {

    List<ModelVersionEntity> findAllByProjectIdOrderByVersionNumberDesc(String projectId);

    Optional<ModelVersionEntity> findByIdAndClientId(String id, String clientId);
}