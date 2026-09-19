package com.flowableplus.modeler.publication;

import java.util.Optional;

import com.flowableplus.contracts.PublicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PublicationRecordRepository extends JpaRepository<PublicationRecordEntity, String> {

    Optional<PublicationRecordEntity> findFirstByClientIdAndModelKeyAndActiveTrueAndStatus(
            String clientId, String modelKey, PublicationStatus status);
}