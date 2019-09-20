import { getOr } from "lodash/fp";
import React from "react";
import Markdown from "react-markdown/with-html";

import Enum from "./Enum";
import Filterable from "./Filterable";
import Nullable from "./Nullable";
import SubResponse from "./SubResponse";
import CharDisplay from "./charDisplay";

export const BodySchema = props => {
  const { data } = props;
  const schema = getOr(
    [],
    ["requestBody", "content", "application_json", "schema"],
    data
  );

  const requiredProperties = schema.required || [];
  const properties = schema.properties;

  const sortByRequired = (a, b) => {
    const r1 = requiredProperties.includes(a) ? 1 : 0;
    const r2 = requiredProperties.includes(b) ? 1 : 0;
    // sorting and adding required fields at the top
    if (r1 > r2) {
      return -1;
    }
    if (r1 < r2) {
      return 1;
    }
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    return 0;
  };

  return (
    <>
      <div className="my-8">
        <h3>Request Body Schema</h3>
      </div>
      {properties &&
        Object.keys(properties)
          .filter(v => properties[v] !== null)
          .sort(sortByRequired)
          .map((p, i) => {
            const b = properties[p];
            return (
              b &&
              b.readOnly !== true && (
                <div key={i} className="response-wrapper">
                  <div className="lg:flex mb-4 pt-2 initResponse">
                    <div className="w-full lg:w-1/4">
                      <div>
                        <b className={b.deprecated && "line-through"}>{p}</b>
                      </div>
                      <div className="leading-xs">
                        {requiredProperties &&
                          requiredProperties.map((req, i) => {
                            if (p === req) {
                              return (
                                <span className="text-BaseRed text-sm" key={i}>
                                  Required
                                </span>
                              );
                            }
                            return false;
                          })}
                      </div>
                      {b.x_linode_filterable && <Filterable />}
                      {b.nullable && <Nullable />}
                    </div>
                    <div className="w-full lg:w-3/4">
                      <div className="text-sm leading-text-sm text-grey-darkest">
                        {b.type} <CharDisplay data={b} />
                        {b.pattern && <span className="tag">{b.pattern}</span>}
                      </div>
                      {b.deprecated && (
                        <div>
                          <span className="tag tag-deprecated">Deprecated</span>
                        </div>
                      )}
                      {b.enum && <Enum dataSource={b} />}
                      <Markdown
                        source={b.description}
                        escapeHtml={false}
                        className="api-desc"
                      />
                    </div>
                  </div>
                  {b.properties && (
                    <div className="px-4 mt-4 mb-4 ml-4 subResponse">
                      <SubResponse dataSource={b.properties} />
                    </div>
                  )}
                </div>
              )
            );
          })}
      {schema.allOf &&
        Object.keys(schema.allOf).map(a => {
          const s = schema.allOf[a];
          return (
            s.properties &&
            Object.keys(s.properties)
              .filter(v => s.properties[v] !== null)
              .sort(sortByRequired)
              .map((p, i) => {
                const b = s.properties[p];
                return (
                  b &&
                  b.readOnly !== null &&
                  b.readOnly !== true && (
                    <div key={i} className="response-wrapper">
                      <div className="lg:flex pt-2 mb-4 initResponse">
                        <div className="w-full lg:w-1/4">
                          <div>
                            <b>{p}</b>
                          </div>
                          <div className="leading-xs">
                            {s.required &&
                              s.required.map((req, i) => {
                                if (p === req) {
                                  return (
                                    <span
                                      className="text-BaseRed text-sm"
                                      key={i}
                                    >
                                      Required
                                    </span>
                                  );
                                }
                                return false;
                              })}
                          </div>
                          <div className="leading-xs">
                            {requiredProperties &&
                              requiredProperties.map((req, i) => {
                                if (p === req) {
                                  return (
                                    <span
                                      className="text-BaseRed text-sm"
                                      key={i}
                                    >
                                      Required
                                    </span>
                                  );
                                }
                                return false;
                              })}
                          </div>
                          <div className="leading-xs mt-1">
                            {b.x_linode_filterable && (
                              <span className="text-grey-dark text-sm">
                                Filterable
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="w-full lg:w-3/4">
                          <div className="text-sm leading-text-sm text-grey-darkest">
                            {b.type} <CharDisplay data={b} />
                            {b.pattern && (
                              <span className="tag">{b.pattern}</span>
                            )}
                          </div>
                          <Markdown
                            source={b.description}
                            escapeHtml={false}
                            className="api-desc"
                          />
                        </div>
                      </div>
                      {b.properties && (
                        <div className="px-4 mt-4 mb-4 ml-4 subResponse">
                          <SubResponse dataSource={b.properties} />
                        </div>
                      )}
                    </div>
                  )
                );
              })
          );
        })}
    </>
  );
};

export default BodySchema;
