package com.flowableplus.modeler.model;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ModelProjectRepository extends JpaRepository<ModelProjectEntity, String> {

    Optional<ModelProjectEntity> findByIdAndClientId(String id, String clientId);

    List<ModelProjectEntity> findAllByClientId(String clientId);
}