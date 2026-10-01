package com.flowableplus.work.publication;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PublicationRecordRepository extends JpaRepository<PublicationRecordEntity, String> {

    Optional<PublicationRecordEntity> findByClientIdAndModelKeyAndVersionAndIdempotencyKey(
            String clientId, String modelKey, int version, String idempotencyKey);

    Optional<PublicationRecordEntity> findByClientIdAndModelKeyAndActiveTrue(String clientId, String modelKey);

    List<PublicationRecordEntity> findAllByActiveTrue();

    List<PublicationRecordEntity> findAllByClientIdAndActiveTrue(String clientId);
}