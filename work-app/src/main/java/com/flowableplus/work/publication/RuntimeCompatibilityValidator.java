package com.flowableplus.work.publication;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;

import com.flowableplus.contracts.DocumentPayload;
import com.flowableplus.contracts.ModelType;
import com.flowableplus.contracts.PublicationEnvelope;
import com.flowableplus.contracts.StructuredError;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.xml.sax.InputSource;
import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilderFactory;

public class RuntimeCompatibilityValidator {

    public List<StructuredError> validate(PublicationEnvelope envelope) {
        List<StructuredError> errors = new ArrayList<>();
        Document document;
        try {
            document = parse(envelope.document().xml());
        } catch (Exception exception) {
            errors.add(error("RUNTIME_XML_INVALID", "Runtime definition XML is not well formed", envelope.correlationId()));
            return List.copyOf(errors);
        }

        Element root = document.getDocumentElement();
        if (!hasName(root, "definitions")) {
            errors.add(error("RUNTIME_ROOT_INVALID", "Runtime definition must have a definitions root", envelope.correlationId()));
        }
        DocumentPayload payload = envelope.document();
        if (payload.modelType() == ModelType.BPMN) {
            Element process = firstElement(document, "process");
            if (process == null || blank(process.getAttribute("id"))) {
                errors.add(error("RUNTIME_BPMN_PROCESS_REQUIRED", "BPMN process id is required", envelope.correlationId()));
            }
            if (hasElement(document, "inclusiveGateway") || hasElement(document, "eventBasedGateway")) {
                errors.add(error("RUNTIME_BPMN_FEATURE_UNSUPPORTED", "Inclusive and event-based gateways are not supported by this runtime", envelope.correlationId()));
            }
        } else {
            Element caseElement = firstElement(document, "case");
            if (caseElement == null || blank(caseElement.getAttribute("id"))) {
                errors.add(error("RUNTIME_CMMN_CASE_REQUIRED", "CMMN case id is required", envelope.correlationId()));
            }
            if (hasElement(document, "discretionaryItem") || hasElement(document, "eventListener")) {
                errors.add(error("RUNTIME_CMMN_FEATURE_UNSUPPORTED", "Discretionary items and event listeners are not supported by this runtime", envelope.correlationId()));
            }
        }
        return List.copyOf(errors);
    }

    private Document parse(String xml) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
        factory.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
        factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
        factory.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
        factory.setAttribute(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");
        return factory.newDocumentBuilder().parse(new InputSource(new StringReader(xml)));
    }

    private Element firstElement(Document document, String localName) {
        var nodes = document.getElementsByTagNameNS("*", localName);
        return nodes.getLength() == 0 ? null : (Element) nodes.item(0);
    }

    private boolean hasElement(Document document, String localName) {
        return firstElement(document, localName) != null;
    }

    private boolean hasName(Element element, String name) {
        return element != null && (name.equals(element.getLocalName()) || name.equals(element.getNodeName()));
    }

    private StructuredError error(String code, String message, String correlationId) {
        return new StructuredError(code, message, correlationId, List.of());
    }

    private boolean blank(String value) {
        return value == null || value.isBlank();
    }
}