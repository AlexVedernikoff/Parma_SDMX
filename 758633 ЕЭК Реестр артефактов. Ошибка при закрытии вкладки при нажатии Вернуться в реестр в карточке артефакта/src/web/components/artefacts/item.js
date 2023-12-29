import { Checkbox, Colors, Icon, Spinner } from "@blueprintjs/core";
import { getRequestArgs } from "@sis-cc/dotstatsuite-sdmxjs";
import glamorous from "glamorous";
import PropTypes from "prop-types";
import { assoc, is, propOr, isNil } from "ramda";
import React from "react";
import { Link } from "react-router-dom";
import { compose, mapProps } from "recompose";
import { parseString } from "xml2js";

import apiManager from "../../apiManager";
import { pagesDictionary, cardType, COLLECTION_FORM } from "../../constants";
import { withCategorisationState } from "../../modules/categorize";
import { withAuthHeader } from "../../modules/common/withauth";
import { withDataflowDetails } from "../../modules/dataflow-details";
import { withExportData } from "../../modules/export-data";
import filterTypesConstants from "../../modules/filters/constants";
import { FormattedMessage, withLocale } from "../../modules/i18n";
import { withSelectedState } from "../../modules/selection";
import { withTransferArtefact } from "../../modules/transfer-artefact";
import { withTransferData } from "../../modules/transfer-data";
import AntdTag from "../common/antd-tag";
import Space from "../common/space";
import messages from "../messages";

import { ItemActions } from "./actions";
import DataFlowDetails from "./dataflow-details";
import itemLogs from "./item-logs";

const StyledCheckbox = glamorous(Checkbox)({
  marginBottom: "0 !important",
  paddingLeft: "33px !important",
});

const Container = glamorous.div({
  marginTop: 10,
  paddingTop: 10,
  borderTop: "1px solid #ccc",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
});

const ItemStyled = glamorous.div({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  justifyContent: "start",
  padding: "10px 20px",
});

const StyledPending = glamorous.div({
  marginTop: 10,
  paddingTop: 10,
  borderTop: "1px solid #ccc",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
});

const Resume = glamorous.div({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
});

const Interface = glamorous.div({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "5px",
});

const Flex = glamorous.div({
  display: "flex",
  flexDirection: "column",
  width: "97%",
  gap: "10px",
});

const MainInfo = glamorous.div({
  display: "flex",
  alignItems: "center",
});

const Detail = glamorous.div({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginLeft: "33px",
});

//--------------------------------------------------------------------------------------------------
export const IsFinal = ({ isFinal }) => {
  if (!isFinal) return null;

  return (
    <span>
      <glamorous.Span>
        <FormattedMessage id="artefact.is.final" />
      </glamorous.Span>
    </span>
  );
};

IsFinal.propTypes = {
  isFinal: PropTypes.bool,
};

//--------------------------------------------------------------------------------------------------

const IconStyled = glamorous(Icon)({ marginLeft: 10, marginRight: 10 });
const SpinnerStyled = glamorous(Spinner)({ marginRight: 10 });

//--------------------------------------------------------------------------------------------------
const ItemPending = ({ iconName, message, children }) => {
  return (
    <StyledPending>
      <SpinnerStyled />
      {iconName ? <Icon iconName={iconName} style={{ color: Colors.GRAY1 }} /> : null}
      <glamorous.Span marginLeft={10}>{message}</glamorous.Span>
      {children}
    </StyledPending>
  );
};

ItemPending.propTypes = {
  iconName: PropTypes.string,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  children: PropTypes.array,
};

//--------------------------------------------------------------------------------------------------
const ItemView = (props) => {
  const {
    id,
    urn,
    url,
    isDeletable,
    isExportingData,
    label,
    type,
    code,
    version,
    isFinal,
    agencyId,
    space,
    isNew,
    error,
    handlers,
    isSelectable,
    isSelected,
    onClick,
    hasData,
    categorisation,
    isCategorizing,
    observations,
    isDetailsExpanded,
    deleteDetails,
    requestDetails,
    annotations,
  } = props;
  const transferArtefact = props.transferArtefact;

  const urlUpdateCollectionForm = `${pagesDictionary.collectionForm}?space=${space.id}&agencyId=${agencyId}&codeId=${code}&version=${version}&mode=${cardType.update}`;
  const urlReadArtefact = `${pagesDictionary.cardArtefact}?type=${type}&space=${space.id}&agencyId=${agencyId}&codeId=${code}&version=${version}&url=${url}&urn=${urn}&mode=${cardType.read}`;

  if (transferArtefact.isTransfering) {
    return (
      <ItemPending
        message={<FormattedMessage id="artefact.is.transfering" />}
        iconName="add-to-artifact"
      />
    );
  }

  if (isExportingData) {
    return (
      <ItemPending
        message={<FormattedMessage id="artefact.is.exporting.data" />}
        iconName="download"
      />
    );
  }

  if (isCategorizing) {
    return (
      <ItemPending message={<FormattedMessage id="artefact.categorising" />} iconName="download" />
    );
  }

  const transferData = props.transferData;
  if (transferData.isTransfering) {
    return (
      <ItemPending message={<FormattedMessage id="artefact.is.transfering.data" />}>
        <IconStyled iconName="arrow-right" style={{ color: Colors.GRAY1 }} />
        <Space {...transferData.destinationSpace} />
      </ItemPending>
    );
  }

  const ItemLogs = itemLogs(id);

  return (
    <Container>
      <ItemStyled>
        <Resume>
          <Flex>
            <MainInfo>
              <StyledCheckbox
                checked={isSelected}
                disabled={!isSelectable}
                onChange={() => props.toggleArtefact(id)}
              />
              <glamorous.Div display="flex" gap={7}>
                <glamorous.Div>
                  <AntdTag>
                    <FormattedMessage
                      {...propOr({ id: type }, `artefact.type.${type}`, messages)}
                    />
                  </AntdTag>
                  <glamorous.Span marginLeft={10}>
                    <button
                      onClick={() => {
                        window.open(
                          type === COLLECTION_FORM ? urlUpdateCollectionForm : urlReadArtefact,
                          "_blank"
                        );
                      }}
                    >
                      {isNil(label) ? <FormattedMessage id="artefact.no.label" /> : label}
                    </button>
                    {/* <Link
                      to={type === COLLECTION_FORM ? urlUpdateCollectionForm : urlReadArtefact}
                      target="_blank"
                    ></Link> */}
                  </glamorous.Span>
                </glamorous.Div>
              </glamorous.Div>
            </MainInfo>
            {type !== filterTypesConstants.dataFlow.value && (
              <Detail>
                <span>{code}</span>
                <span>{version}</span>
                <IsFinal isFinal={isFinal} />
                <span>{agencyId}</span>
              </Detail>
            )}
          </Flex>

          <Interface>
            <ItemLogs artefactId={id} isNew={isNew} error={error} />
            <ItemActions
              annotations={annotations}
              artefactId={id}
              artefactName={label}
              artefactType={type}
              artefactDelete={handlers.artefactDelete}
              artefactExport={handlers.artefactExportStructure}
              categorisation={categorisation}
              dataExport={props.exportData}
              hasData={hasData}
              isDeletable={isDeletable}
              type={type}
            />
          </Interface>
        </Resume>

        {type === filterTypesConstants.dataFlow.value &&
          hasData &&
          is(Function, requestDetails) && (
            <DataFlowDetails
              code={code}
              version={version}
              isFinal={isFinal}
              agencyId={agencyId}
              spaceLabel={space.label}
              id={id}
              observations={observations}
              isDetailsExpanded={isDetailsExpanded}
              request={isDetailsExpanded ? deleteDetails : requestDetails}
              requestDetails={requestDetails}
            />
          )}
      </ItemStyled>
    </Container>
  );
};

ItemView.propTypes = {
  dataExplorerUrl: PropTypes.string,
  hasData: PropTypes.bool,
  locale: PropTypes.string,
  id: PropTypes.string.isRequired,
  url: PropTypes.string,
  urn: PropTypes.string,
  isDeletable: PropTypes.bool,
  isExportingData: PropTypes.bool,
  exportData: PropTypes.func,
  onClick: PropTypes.func,
  label: PropTypes.string,
  type: PropTypes.string,
  code: PropTypes.string,
  version: PropTypes.string,
  isFinal: PropTypes.bool,
  agencyId: PropTypes.string,
  isNew: PropTypes.bool,
  error: PropTypes.object,
  handlers: PropTypes.object,
  space: PropTypes.shape({
    color: PropTypes.string,
  }).isRequired,
  isSelectable: PropTypes.bool,
  isSelected: PropTypes.bool,
  categorisation: PropTypes.func,
};

//--------------------------------------------------------------------------------------------------
const itemProxy = (id) =>
  compose(
    withLocale,
    withSelectedState(id),
    withTransferArtefact(id),
    mapProps(({ agencyId, code, error, space, type, version, locale, ...rest }) => {
      const { url, headers } = getRequestArgs({
        identifiers: { agencyId, code, version },
        type,
        // format: 'xml',
        datasource: assoc("url", space.endpoint, space),
        withUrn: false,
      });
      return {
        ...rest,
        agencyId,
        artefactError: error,
        code,
        hasData: type === "dataflow",
        dataExplorerUrl:
          space.dataExplorerUrl && !isNil(space.dataExplorerUrl)
            ? `${space.dataExplorerUrl}/vis?locale=${locale}&dataflow[datasourceId]=${space.id}&dataflow[agencyId]=${agencyId}&dataflow[dataflowId]=${code}&dataflow[version]=${version}&hasDataAvailability=true`
            : null,
        isDeletable: !isNil(space.transferUrl),
        space,
        type,
        version,
      };
    }),
    mapProps(({ isTransfering, isUpdating, destinationSpace, ...rest }) => ({
      ...rest,
      transferArtefact: { isTransfering, isUpdating, destinationSpace },
    })),
    withTransferData(id),
    mapProps(({ isTransfering, isUpdating, destinationSpace, ...rest }) => ({
      ...rest,
      transferData: { isTransfering, isUpdating, destinationSpace },
    })),
    withExportData(id),
    mapProps(({ artefactError, error, ...rest }) => ({
      ...rest,
      error: assoc("exportData", error, artefactError),
    })),
    withDataflowDetails(id),
    withCategorisationState(id),
    mapProps(({ id, space, artefactCategorisation, ...rest }) => ({
      ...rest,
      id,
      space,
      categorisation: isNil(space.transferUrl)
        ? null
        : () => artefactCategorisation({ id, space }),
    }))
  )(ItemView);

//--------------------------------------------------------------------------------------------------
export const Item = ({ id, isDeleting, isExporting, ...rest }) => {
  if (isDeleting)
    return (
      <ItemPending message={<FormattedMessage id="artefact.is.deleting" />} iconName="trash" />
    );
  if (isExporting)
    return (
      <ItemPending
        message={<FormattedMessage id="artefact.is.exporting.structure" />}
        iconName="download"
      />
    );
  const ItemProxy = itemProxy(id);

  return <ItemProxy id={id} {...rest} />;
};

Item.propTypes = {
  id: PropTypes.string.isRequired,
  isDeleting: PropTypes.bool,
  isExporting: PropTypes.bool,
};
