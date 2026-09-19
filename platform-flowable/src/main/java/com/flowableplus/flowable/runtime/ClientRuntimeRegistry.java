package com.flowableplus.flowable.runtime;

public interface ClientRuntimeRegistry {

    ClientRuntimeTarget resolve(String clientId);
}