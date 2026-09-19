package com.flowableplus.modeler.validation;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;

import com.flowableplus.contracts.FormField;
import com.flowableplus.contracts.FormFieldType;
import com.flowableplus.contracts.FormSchema;
import com.flowableplus.contracts.ModelType;
import com.flowableplus.contracts.StructuredError;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilderFactory;

@Service
public class ModelDocumentValidator {

    public ModelValidationResult validate(ModelType modelType, String xml, FormSchema formSchema, String correlationId) {
        List<StructuredError> errors = new ArrayList<>();
        Document document;
        try {
            document = parse(xml);
        } catch (Exception exception) {
            errors.add(error("MALFORMED_XML", "Model XML is not well formed", correlationId));
            return new ModelValidationResult(false, null, List.copyOf(errors));
        }

        Element root = document.getDocumentElement();
        if (!"definitions".equals(root.getLocalName()) && !"definitions".equals(root.getNodeName())) {
            errors.add(error("ROOT_ELEMENT_REQUIRED", "Model XML must have a definitions root", correlationId));
        }
        if (modelType == ModelType.BPMN) {
            validateBpmn(document, errors, correlationId);
        } else if (modelType == ModelType.CMMN) {
            validateCmmn(document, errors, correlationId);
        }
        validateFormSchema(formSchema, errors, correlationId);

        NormalizedModelMetadata metadata = normalize(modelType, document);
        return new ModelValidationResult(errors.isEmpty(), metadata, List.copyOf(errors));
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

    private void validateBpmn(Document document, List<StructuredError> errors, String correlationId) {
        Element process = firstElement(document, "process");
        if (process == null || blank(process.getAttribute("id"))) {
            errors.add(error("BPMN_PROCESS_ID_REQUIRED", "BPMN process id is required", correlationId));
        }
        if (hasElement(document, "inclusiveGateway") || hasElement(document, "eventBasedGateway")) {
            errors.add(error("BPMN_FEATURE_UNSUPPORTED", "Inclusive and event-based gateways are deferred", correlationId));
        }
    }

    private void validateCmmn(Document document, List<StructuredError> errors, String correlationId) {
        Element caseElement = firstElement(document, "case");
        if (caseElement == null || blank(caseElement.getAttribute("id"))) {
            errors.add(error("CMMN_CASE_ID_REQUIRED", "CMMN case id is required", correlationId));
        }
        if (hasElement(document, "discretionaryItem") || hasElement(document, "eventListener")) {
            errors.add(error("CMMN_FEATURE_UNSUPPORTED", "Advanced discretionary items and event listeners are deferred", correlationId));
        }
    }

    private void validateFormSchema(FormSchema schema, List<StructuredError> errors, String correlationId) {
        if (schema == null) {
            return;
        }
        if (blank(schema.schemaVersion())) {
            errors.add(error("FORM_SCHEMA_VERSION_REQUIRED", "Form schema version is required", correlationId));
        }
        for (FormField field : schema.fields()) {
            if (field == null || blank(field.id()) || blank(field.label()) || field.type() == null || blank(field.variableName())) {
                errors.add(error("FORM_FIELD_METADATA_INVALID", "Form fields require id, label, type, and variable mapping", correlationId));
            } else if (field.type() == FormFieldType.SELECT && (field.options() == null || field.options().isEmpty())) {
                errors.add(error("FORM_SELECT_OPTIONS_REQUIRED", "Select fields require options", correlationId));
            }
        }
    }

    private NormalizedModelMetadata normalize(ModelType modelType, Document document) {
        Element model = firstElement(document, modelType == ModelType.BPMN ? "process" : "case");
        String key = model == null ? null : model.getAttribute("id");
        String name = model == null ? null : model.getAttribute("name");
        List<String> taskIds = new ArrayList<>();
        collectIds(document, "userTask", taskIds);
        collectIds(document, "humanTask", taskIds);
        return new NormalizedModelMetadata(modelType, key, blank(name) ? key : name, List.copyOf(taskIds));
    }

    private void collectIds(Document document, String localName, List<String> ids) {
        NodeList nodes = document.getElementsByTagNameNS("*", localName);
        for (int index = 0; index < nodes.getLength(); index++) {
            Node node = nodes.item(index);
            if (node instanceof Element element && !blank(element.getAttribute("id"))) {
                ids.add(element.getAttribute("id"));
            }
        }
    }

    private Element firstElement(Document document, String localName) {
        NodeList nodes = document.getElementsByTagNameNS("*", localName);
        return nodes.getLength() == 0 ? null : (Element) nodes.item(0);
    }

    private boolean hasElement(Document document, String localName) {
        return firstElement(document, localName) != null;
    }

    private StructuredError error(String code, String message, String correlationId) {
        return new StructuredError(code, message, correlationId, List.of());
    }

    private boolean blank(String value) {
        return value == null || value.isBlank();
    }
}