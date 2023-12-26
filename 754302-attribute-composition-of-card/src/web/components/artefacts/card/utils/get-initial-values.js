import { initialFormAgencyScheme } from "../agencyscheme/lib/constants";
import { initialFormCategorySchemes } from "../categoryscheme/lib";
import { initialFormCodelist } from "../codelist/lib";
import { initialFormConcepts } from "../concepts/lib";
import { initialFormContentconstraint } from "../contentconstraint/lib";
import { initialFormDataflow } from "../dataflow/lib";
import { initialFormDataproviderscheme } from "../dataproviderscheme/lib";
import { initialFormDataStructures } from "../datastructure/lib";
import { initialFormOrganisationScheme } from "../organisationunitscheme/lib/constants";
import { initialFormProvisionAgreement } from "../provisionagreement/lib";

const artefactTypes = {
  agencyscheme: initialFormAgencyScheme,
  organisationunitscheme: initialFormOrganisationScheme,
  codelist: initialFormCodelist,
  datastructure: initialFormDataStructures,
  conceptscheme: initialFormConcepts,
  categoryscheme: initialFormCategorySchemes,
  dataflow: initialFormDataflow,
  dataproviderscheme: initialFormDataproviderscheme,
  provisionagreement: initialFormProvisionAgreement,
  contentconstraint: initialFormContentconstraint,
};

// ************************************************************
export const getInitialValues = (type) => {
  console.log("getInitialValues(type) type = ", type);
  return artefactTypes[type] || artefactTypes;
};
// ************************************************************
