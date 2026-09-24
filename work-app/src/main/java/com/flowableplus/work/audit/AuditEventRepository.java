package com.flowableplus.work.audit;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditEventRepository extends JpaRepository<AuditEventEntity, String> {
    List<AuditEventEntity> findAllByClientIdOrderByTimestampDesc(String clientId);

    List<AuditEventEntity> findAllByClientIdAndTargetOrderByTimestampDesc(String clientId, String target);
}