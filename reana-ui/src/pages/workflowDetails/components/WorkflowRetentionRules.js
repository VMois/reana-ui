/*
  -*- coding: utf-8 -*-

  This file is part of REANA.
  Copyright (C) 2022 CERN.

  REANA is free software; you can redistribute it and/or modify it
  under the terms of the MIT License; see LICENSE file for more details.
*/

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Accordion, Icon, Label, Table } from "semantic-ui-react";

import { fetchWorkflow } from "~/actions";
import { getWorkflow } from "~/selectors";

import styles from "./WorkflowRetentionRules.module.scss";

function LabelRule({ workspaceFiles }) {
  return <Label className={styles["rule-label"]}>{workspaceFiles}</Label>;
}

export default function WorkflowRetentionRules({ id }) {
  const dispatch = useDispatch();
  const workflow = useSelector(getWorkflow(id));

  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    dispatch(fetchWorkflow(id));
  }, [dispatch, id]);

  const handleClick = () => {
    setShowRules((showRules) => !showRules);
  };

  const rules = workflow.retentionRules || [];
  if (rules.length === 0) {
    return null;
  }

  // First rule that still needs to be applied
  const nextRule = rules.find(({ active, created }) => active || created);

  const generateTitle = (nextRule) => {
    if (!nextRule) {
      return "Retention rules";
    }
    const { workspaceFiles, retentionDays, timeBeforeExecution } = nextRule;
    const when =
      timeBeforeExecution || `${retentionDays} days after the workflow's end`;
    return (
      <>
        Note: files matching the pattern{" "}
        <LabelRule workspaceFiles={workspaceFiles} /> will be deleted {when}.
      </>
    );
  };

  return (
    <Accordion styled fluid className={styles.rules}>
      <Accordion.Title index={0} active={showRules} onClick={handleClick}>
        <Icon name="dropdown" />
        {generateTitle(nextRule)}
      </Accordion.Title>
      <Accordion.Content index={0} active={showRules}>
        <Table compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Workspace files</Table.HeaderCell>
              <Table.HeaderCell>Retention days</Table.HeaderCell>
              <Table.HeaderCell>Deletion</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rules.map((rule, index) => (
              <Table.Row key={index} disabled={rule.applied || rule.inactive}>
                <Table.Cell>
                  <LabelRule workspaceFiles={rule.workspaceFiles} />
                </Table.Cell>
                <Table.Cell>{rule.retentionDays}</Table.Cell>
                <Table.Cell>
                  {rule.applied ? (
                    "already applied"
                  ) : rule.inactive ? (
                    "inactive rule"
                  ) : rule.active ? (
                    <span title={rule.applyOn}>{rule.timeBeforeExecution}</span>
                  ) : (
                    "-"
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Accordion.Content>
    </Accordion>
  );
}

WorkflowRetentionRules.propTypes = {
  id: PropTypes.string.isRequired,
};
