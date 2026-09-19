package com.flowableplus.flowable.runtime;

public interface ClientRuntimeProvisioner {

    ClientRuntimeTarget provision(RuntimeProvisioningRequest request);
}