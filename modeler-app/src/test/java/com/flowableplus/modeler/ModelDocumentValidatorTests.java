package com.flowableplus.modeler;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import com.flowableplus.contracts.FormField;
import com.flowableplus.contracts.FormFieldType;
import com.flowableplus.contracts.FormSchema;
import com.flowableplus.contracts.ModelType;
import com.flowableplus.modeler.validation.ModelDocumentValidator;
import org.junit.jupiter.api.Test;

class ModelDocumentValidatorTests {

    private final ModelDocumentValidator validator = new ModelDocumentValidator();

    @Test
    void reportsMalformedXmlAndMissingIdentifiers() {
        var result = validator.validate(ModelType.BPMN, "<definitions><process></definitions>", null, "validation-1");

        assertThat(result.valid()).isFalse();
        assertThat(result.errors()).extracting(error -> error.code())
                .contains("MALFORMED_XML");
    }

    @Test
    void rejectsDeferredGatewayAndInvalidFormMetadata() {
        String xml = "<definitions xmlns='http://www.omg.org/spec/BPMN/20100524/MODEL'"
                + "><process id='leave'><inclusiveGateway id='gateway'/></process></definitions>";
        FormSchema form = new FormSchema("", List.of(
                new FormField("choice", "Choice", FormFieldType.SELECT, true, null, "choice", List.of())));

        var result = validator.validate(ModelType.BPMN, xml, form, "validation-2");

        assertThat(result.valid()).isFalse();
        assertThat(result.errors()).extracting(error -> error.code())
                .contains("BPMN_FEATURE_UNSUPPORTED", "FORM_SCHEMA_VERSION_REQUIRED", "FORM_SELECT_OPTIONS_REQUIRED");
    }
}