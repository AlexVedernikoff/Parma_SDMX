import { Form as AntForm } from "antd";
import React, { useEffect } from "react";

import { cardType } from "../../../../../constants";
import useQuery from "../../../../../lib/hooks/use-query";
import useTabHeading from "../../../../../lib/hooks/use-tab-heading";
import { Form } from "../../../../form";
import { useArtefactContext, useArtefactValuesContext } from "../../artefact-context";
import { artefactType } from "../../constants";
import { DEFAULT_VALUE, DEFAULT_VERSION, conceptsFieldIds } from "../lib/constants";

import { getListFields } from "./listFields";

function FormArtefact() {
  const [form] = AntForm.useForm();
  const { mode } = useQuery();
  const heading = useTabHeading(`Сведения о ${artefactType.conceptscheme.firstTabHeader}`);

  const { values, initialValues, handleChangeFormField } = useArtefactValuesContext();
  const { validationErrors } = useArtefactContext();

  useEffect(() => {
    if (Object.keys(validationErrors).length) {
      form.validateFields();
    }
  }, [form, validationErrors]);

  useEffect(() => {
    if (mode === cardType.create && !values?.id) {
      handleChangeFormField(conceptsFieldIds.id, DEFAULT_VALUE);
    }
  }, [mode, values, handleChangeFormField]);

  useEffect(() => {
    if (mode === cardType.create && !values?.version) {
      handleChangeFormField(conceptsFieldIds.version, DEFAULT_VERSION);
    }
  }, [mode, values, handleChangeFormField]);

  const onChangeForm = (values) => {
    Object.entries(values).forEach(([key, value]) => {
      handleChangeFormField(key, value);
    });
  };

  if (mode !== cardType.create && (values === null || values.id === "")) {
    return null;
  }
  // ************************************************************
  console.log("form fields initialValues = ", initialValues);
  console.log("form fields mode = ", mode);
  console.log("form fields = ", getListFields(mode, initialValues));
  console.log("form = ", form);
  // ************************************************************

  return (
    <>
      <div>Этот компонент рендерит создание нового артефакта</div>
      {heading}
      <Form
        form={form}
        fields={getListFields(mode, initialValues)}
        values={values}
        onChange={onChangeForm}
      />
    </>
  );
}

export default FormArtefact;
