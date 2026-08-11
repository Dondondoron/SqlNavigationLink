"use strict";
(() => {
  // lineageViewerTS/src/utils/vscodeAPI.ts
  var vscodeApi;
  function getVsCodeApi() {
    return void 0;
    if (!vscodeApi) {
      vscodeApi = acquireVsCodeApi();
    }
    return vscodeApi;
  }

  // lineageViewerTS/src/utils/Utility.ts
  var Utility = class {
    static generateId() {
      return Math.random().toString(36).substring(2, 9);
    }
  };

  // lineageViewerTS/src/managing/Card.ts
  var Card = class _Card {
    constructor(data, isCenter = false, direction = "left", cardContainer = document.createElement("div"), card = document.createElement("div"), cardHeader = document.createElement("header"), titleSpan = document.createElement("span"), fieldButton = document.createElement("button"), fieldsContainer = document.createElement("ul"), childCards = /* @__PURE__ */ new Map()) {
      this.cardContainer = cardContainer;
      this.card = card;
      this.cardHeader = cardHeader;
      this.titleSpan = titleSpan;
      this.fieldButton = fieldButton;
      this.fieldsContainer = fieldsContainer;
      this.childCards = childCards;
      const id = Utility.generateId();
      this.isCenter = isCenter;
      cardContainer.className = "card_container";
      card.className = "node-card" + (isCenter ? " center" : "");
      const modelInfo = data.model;
      const name = modelInfo.fullname ?? modelInfo.name;
      cardContainer.dataset.card = name;
      titleSpan.textContent = name;
      _Card.card_stack.set(name, this);
      fieldButton.className = "fieldButton";
      fieldButton.dataset.card = name;
      fieldButton.dataset.id = id;
      fieldButton.textContent = "\u2261";
      cardHeader.appendChild(titleSpan);
      card.appendChild(cardHeader);
      this.columnData = modelInfo.columns ? new Map(Object.entries(modelInfo.columns)) : /* @__PURE__ */ new Map();
      if (modelInfo.cte_columns) {
        Object.entries(modelInfo.cte_columns).forEach((ctc) => {
          const cteMap = new Map(Object.entries(ctc[1]));
          this.cteColumnData.set(ctc[0], cteMap);
        });
      }
      if (modelInfo.columns) {
        cardHeader.appendChild(fieldButton);
        fieldsContainer.id = "fields-" + id;
        fieldsContainer.className = "fields-container";
        if (!isCenter) fieldsContainer.style.display = "none";
        for (const field of Object.entries(modelInfo.columns)) {
          const fieldItem = document.createElement("li");
          fieldItem.className = "field-item column-item";
          fieldItem.textContent = field[0];
          fieldItem.dataset.column = field[0];
          fieldsContainer.appendChild(fieldItem);
        }
        card.appendChild(fieldsContainer);
      }
      if (!isCenter && !modelInfo.columns && data.fields && data.fields.length > 0) {
        cardHeader.appendChild(fieldButton);
        fieldsContainer.id = "fields-" + id;
        fieldsContainer.style.display = "none";
        fieldsContainer.className = "fields-container";
        for (const field of data.fields) {
          const fieldItem = document.createElement("li");
          fieldItem.className = "field-item";
          fieldItem.textContent = field;
          fieldItem.dataset.column = field;
          fieldsContainer.appendChild(fieldItem);
        }
        card.appendChild(fieldsContainer);
      }
      const childCardContainer = document.createElement("div");
      childCardContainer.classList.add("child_card_container", direction);
      if (direction === "left") cardContainer.appendChild(childCardContainer);
      cardContainer.appendChild(card);
      if (direction === "right") cardContainer.appendChild(childCardContainer);
      data.refs.forEach((ref) => {
        const newCard = new _Card(ref, false);
        this.childCards.set(name, newCard);
        childCardContainer.appendChild(newCard.cardContainer);
      });
    }
    static card_stack = /* @__PURE__ */ new Map();
    columnData;
    cteColumnData = /* @__PURE__ */ new Map();
    isCenter = false;
    fieldsHidden = false;
    containerHidden = true;
    reset() {
      const columnDivs = this.fieldsContainer.querySelectorAll(".field-item");
      columnDivs.forEach((f) => {
        f.classList.remove("selected");
      });
    }
    toggle() {
      if (this.fieldsHidden) {
        this.showFields();
        return;
      }
      this.showFieldsContainer(!this.containerHidden);
    }
    hideFields() {
      this.fieldsHidden = true;
      const columnDivs = this.fieldsContainer.querySelectorAll(".field-item");
      columnDivs.forEach((f) => {
        if (!f.classList.contains("selected"))
          f.classList.add("hidden");
      });
      this.fieldButton.textContent = "\u{1F441}";
    }
    showFields() {
      const columnDivs = this.fieldsContainer.querySelectorAll(".field-item");
      columnDivs.forEach((f) => {
        f.classList.remove("hidden");
      });
      this.fieldButton.textContent = "\u2B06";
      this.fieldsHidden = false;
    }
    showFieldsContainer(isTrue) {
      this.fieldsContainer.style.display = isTrue ? "flex" : "none";
      this.fieldButton.textContent = isTrue ? "\u2B06" : "\u2261";
      this.containerHidden = isTrue;
    }
    showLineage(column, connect = [], preColumnDiv) {
      const columnDiv = this.fieldsContainer.querySelector(`[data-column="${column}"]`);
      columnDiv?.classList.add("selected");
      if (this.isCenter) {
        this.fieldsContainer.querySelectorAll(".field-item").forEach((c) => c.classList.remove("hidden"));
      } else {
        this.hideFields();
        columnDiv?.classList.add("selected");
      }
      if (preColumnDiv && columnDiv) {
        preColumnDiv?.classList.remove("hidden");
        columnDiv?.classList.remove("hidden");
        connect.push({ a: columnDiv, b: preColumnDiv });
      }
      const columnLineages = this.columnData.get(column);
      columnLineages?.forEach((lineage) => {
        this.resolveLineage(lineage, connect, columnDiv);
      });
      return connect;
    }
    resolveLineage(lineageString, connect, columnDiv) {
      const lineageParts = lineageString.split(".");
      const nextColumn = lineageParts.pop()?.replaceAll('"', "");
      const tableName = lineageParts.join(".");
      const sanitizedTableName = tableName.replaceAll('"', "");
      if (!nextColumn) return;
      const allCards = _Card.card_stack;
      const targetCard = allCards.get(tableName) ?? allCards.get(sanitizedTableName);
      if (targetCard) {
        targetCard.showFieldsContainer(true);
        targetCard.showLineage(nextColumn, connect, columnDiv);
      } else {
        const cteTable = this.cteColumnData.get(tableName) ?? this.cteColumnData.get(sanitizedTableName);
        const cteColumns = cteTable?.get(nextColumn);
        cteColumns?.forEach((nestedLineage) => {
          this.resolveLineage(nestedLineage, connect, columnDiv);
        });
      }
    }
  };

  // lineageViewerTS/src/managing/LineageManager.ts
  var LineageManager = class _LineageManager {
    centerCard;
    svg;
    connections = [];
    constructor() {
      this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      this.svg.classList.add("svg");
      const canvasArea = document.getElementById("lineage-container");
      canvasArea.appendChild(this.svg);
    }
    initData(data) {
      const leftContainer = document.getElementById("left-nodes");
      const centerContainer = document.getElementById("center-nodes");
      const rightContainer = document.getElementById("right-nodes");
      Card.card_stack.clear();
      if (data.centerModel) {
        const centerCard = new Card(data.centerModel, true);
        this.centerCard = centerCard;
        centerContainer.appendChild(centerCard.cardContainer);
      }
      if (data.leftRefs && data.leftRefs.length > 0) {
        data.leftRefs.forEach((ref) => {
          const leftCard = new Card(ref, false, "left");
          leftContainer.appendChild(leftCard.cardContainer);
        });
      } else {
        leftContainer.innerHTML = '<div class="empty-state">None</div>';
      }
      if (data.rightRefs && data.rightRefs.length > 0) {
        data.rightRefs.forEach((ref) => {
          const rightCard = new Card(ref, false, "right");
          rightContainer.appendChild(rightCard.cardContainer);
        });
      } else {
        rightContainer.innerHTML = '<div class="empty-state">None</div>';
      }
    }
    showLineageOnCard(cardId, column) {
      const focusCard = Card.card_stack.get(cardId);
      if (focusCard && focusCard.isCenter) {
        Card.card_stack.forEach((card) => {
          card.reset();
          if (card !== this.centerCard) card.showFieldsContainer(false);
        });
        const connections = focusCard?.showLineage(column, [], null);
        this.connections = connections;
        this.paintConnections(connections);
      }
    }
    clearPaths() {
      this.svg.replaceChildren();
    }
    repaint() {
      this.paintConnections(this.connections);
    }
    paintConnections(connections) {
      this.svg.replaceChildren();
      const svgRect = this.svg.getBoundingClientRect();
      connections.forEach((con) => {
        const rectA = con.a.getBoundingClientRect();
        const rectB = con.b.getBoundingClientRect();
        const fromX = rectA.right - svgRect.left;
        const fromY = rectA.top + rectA.height / 2 - svgRect.top;
        const toX = rectB.left - svgRect.left;
        const toY = rectB.top + rectB.height / 2 - svgRect.top;
        const pathData = _LineageManager.createHorizontalCurvedPath(fromX, fromY, toX, toY);
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathData);
        path.setAttribute("stroke-width", "2");
        path.setAttribute("fill", "none");
        this.svg.appendChild(path);
      });
    }
    static createHorizontalCurvedPath(fromX, fromY, toX, toY) {
      if (toX < fromX) {
        [fromX, toX] = [toX, fromX];
        [fromY, toY] = [toY, fromY];
      }
      const desiredOffset = 0;
      const deltaX = toX - fromX;
      const deltaY = toY - fromY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (distance < 1) return `M ${fromX},${fromY}`;
      const offset = Math.min(desiredOffset, distance / 2);
      const startX = fromX + deltaX / distance * offset;
      const startY = fromY + deltaY / distance * offset;
      const endX = toX - deltaX / distance * offset;
      const endY = toY - deltaY / distance * offset;
      const dy = Math.abs(endY - startY);
      const lerped = Math.max(Math.min((dy - 100) / 400, 1), 0);
      const dx = Math.abs(endX - startX);
      const baseCurve = 400;
      const minCurve = 20;
      const curve = Math.max(baseCurve / ((dx - 50) / 250 + 1), minCurve) * lerped;
      return `M ${startX},${startY} C ${startX + curve},${startY} ${endX - curve},${endY} ${endX},${endY}`;
    }
  };

  // lineageViewerTS/src/managing/lineage.ts
  var vscode = getVsCodeApi();
  window.addEventListener("message", (event) => {
    const message = event.data;
    if (message.command === "renderLineage") {
      renderLineage(message.data);
    }
  });
  var lineageManager = new LineageManager();
  var eventListener = (e) => {
    if (!(e.target instanceof HTMLElement)) return;
    const changeSizeButton = e.target?.closest("button[data-action]");
    if (changeSizeButton instanceof HTMLElement) {
      e.stopPropagation();
      const action = changeSizeButton.dataset.action;
      if (action === "left-decrease" || action === "left-increase") {
        const sizeLabel = document.getElementById("left-lineage-size-label");
        let currentSize = Number(sizeLabel.textContent);
        if (currentSize > 1 && action === "left-decrease") currentSize = currentSize - 1;
        else if (currentSize < 12 && action === "left-increase") currentSize = currentSize + 1;
        sizeLabel.textContent = currentSize + "";
        post(action);
      }
      if (action === "right-decrease" || action === "right-increase") {
        const sizeLabel = document.getElementById("right-lineage-size-label");
        let currentSize = Number(sizeLabel.textContent);
        if (currentSize > 1 && action === "right-decrease") currentSize = currentSize - 1;
        else if (currentSize < 12 && action === "right-increase") currentSize = currentSize + 1;
        sizeLabel.textContent = currentSize + "";
        post(action);
      }
      return;
    }
    const button = e.target.closest(".fieldButton");
    if (button instanceof HTMLElement) {
      e.stopPropagation();
      const card2 = Card.card_stack.get(button.dataset.card ?? "");
      if (card2) {
        card2.toggle();
        lineageManager.repaint();
      }
      return;
    }
    const columnItem = e.target.closest(".column-item");
    if (columnItem instanceof HTMLElement) {
      const cardContainer = e.target.closest(".card_container");
      const column = columnItem.dataset.column;
      lineageManager.showLineageOnCard(cardContainer?.dataset.card, column);
      return;
    }
    const card = e.target.closest(".node-card");
    if (card) {
      const headerSpan = card.querySelector("header span");
      if (headerSpan?.textContent) {
        post("browse", headerSpan.textContent);
      }
    }
  };
  function post(command, ...args) {
    lineageManager.clearPaths();
    vscode?.postMessage({
      command,
      args
    });
  }
  function renderLineage(data) {
    const leftContainer = document.getElementById("left-nodes");
    const centerContainer = document.getElementById("center-nodes");
    const rightContainer = document.getElementById("right-nodes");
    const leftSizeLabel = document.getElementById("left-lineage-size-label");
    leftSizeLabel.textContent = data.size_left;
    const rightSizeLabel = document.getElementById("right-lineage-size-label");
    rightSizeLabel.textContent = data.size_right;
    document.removeEventListener("click", eventListener);
    document.addEventListener("click", eventListener);
    leftContainer.innerHTML = "";
    centerContainer.innerHTML = "";
    rightContainer.innerHTML = "";
    lineageManager.initData(data);
  }
  document.removeEventListener("click", eventListener);
  document.addEventListener("click", eventListener);

  // lineageViewerTS/src/test_data/test_data.ts
  var testData = {
    centerModel: {
      model: {
        collapsibleState: 1,
        label: "group_day_holding_with_bors",
        name: "group_day_holding_with_bors",
        file_name: "group_day_holding_with_bors.sql",
        file_path: "e:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\group_day_holding_with_bors.sql",
        table_names: [
          {
            fullname: '"group_holding_day"',
            name: "group_holding_day",
            db: "",
            catalog: "",
            alias: "ghp",
            fields: [
              "tickersymbol",
              "name",
              "orderbookid",
              "averageacquiredprice",
              "type",
              "instrumentid",
              "prices_on_date"
            ]
          },
          {
            fullname: '"group_holding_day"',
            name: "group_holding_day",
            db: "",
            catalog: "",
            alias: "ghp",
            fields: [
              "orderbookid",
              "prices_on_date"
            ]
          },
          {
            fullname: '"postgres"."public"."bors_info"',
            name: "bors_info",
            db: "public",
            catalog: "postgres",
            alias: "bi",
            fields: [
              "orderbookid",
              "instid"
            ]
          },
          {
            fullname: '"last_two_week_prices"',
            name: "last_two_week_prices",
            db: "",
            catalog: "",
            alias: "lwp",
            fields: [
              "price_data",
              "ins_id"
            ]
          }
        ],
        cte_names: [
          {
            fullname: '"daily_stats"',
            name: "daily_stats",
            db: "",
            catalog: "",
            alias: "daily_stats",
            fields: [
              "orderbookid",
              "close_p",
              "high_p",
              "r_date",
              "open_p",
              "low_p"
            ]
          },
          {
            fullname: '"calculated_backup"',
            name: "calculated_backup",
            db: "",
            catalog: "",
            alias: "cb",
            fields: [
              "orderbookid",
              "generated_price_data"
            ]
          }
        ],
        columns: {
          averageacquiredprice: [
            '"group_holding_day"."averageacquiredprice"'
          ],
          instrumentid: [
            '"group_holding_day"."instrumentid"'
          ],
          name: [
            '"group_holding_day"."name"'
          ],
          tickersymbol: [
            '"group_holding_day"."tickersymbol"'
          ],
          orderbookid: [
            '"group_holding_day"."orderbookid"'
          ],
          prices_on_date: [
            '"group_holding_day"."prices_on_date"'
          ],
          type: [
            '"group_holding_day"."type"'
          ],
          instid: [
            '"postgres"."public"."bors_info"."instid"'
          ],
          price_data: [
            '"last_two_week_prices"."price_data"',
            '"calculated_backup"."generated_price_data"'
          ]
        },
        cte_columns: {
          daily_stats: {
            orderbookid: [
              '"group_holding_day"."orderbookid"'
            ],
            r_date: [
              '"group_holding_day"."day_data"'
            ],
            low_p: [
              '"group_holding_day"."p_entry"'
            ],
            high_p: [
              '"group_holding_day"."p_entry"'
            ],
            open_p: [
              '"group_holding_day"."p_entry"'
            ],
            close_p: [
              '"group_holding_day"."p_entry"'
            ]
          },
          calculated_backup: {
            orderbookid: [
              '"daily_stats"."orderbookid"'
            ],
            generated_price_data: [
              '"daily_stats"."high_p"',
              '"daily_stats"."r_date"',
              '"daily_stats"."close_p"',
              '"daily_stats"."low_p"',
              '"daily_stats"."open_p"'
            ]
          }
        },
        command: {
          command: "sql-nav-link.openPath",
          title: "group_day_holding_with_bors",
          arguments: [
            "e:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\group_day_holding_with_bors.sql"
          ]
        }
      },
      refs: []
    },
    leftRefs: [
      {
        model: {
          collapsibleState: 1,
          label: "group_holding_day",
          name: "group_holding_day",
          file_name: "group_holding_day.sql",
          file_path: "e:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\group_holding_day.sql",
          table_names: [
            {
              fullname: '"recent_holdings"',
              name: "recent_holdings",
              db: "",
              catalog: "",
              alias: "recent_holdings",
              fields: [
                "tickersymbol",
                "name",
                "orderbookid",
                "date",
                "lastprice",
                "averageacquiredprice",
                "type",
                "instrumentid"
              ]
            }
          ],
          cte_names: [
            {
              fullname: '"agg_on_day"',
              name: "agg_on_day",
              db: "",
              catalog: "",
              alias: "agg_on_day",
              fields: [
                "tickersymbol",
                "name",
                "orderbookid",
                "date",
                "averageacquiredprice",
                "type",
                "prices_dates",
                "instrumentid"
              ]
            }
          ],
          columns: {
            averageacquiredprice: [
              '"agg_on_day"."averageacquiredprice"'
            ],
            instrumentid: [
              '"agg_on_day"."instrumentid"'
            ],
            name: [
              '"agg_on_day"."name"'
            ],
            tickersymbol: [
              '"agg_on_day"."tickersymbol"'
            ],
            orderbookid: [
              '"agg_on_day"."orderbookid"'
            ],
            type: [
              '"agg_on_day"."type"'
            ],
            prices_on_date: [
              '"agg_on_day"."date"',
              '"agg_on_day"."prices_dates"'
            ]
          },
          cte_columns: {
            agg_on_day: {
              averageacquiredprice: [
                '"recent_holdings"."averageacquiredprice"'
              ],
              instrumentid: [
                '"recent_holdings"."instrumentid"'
              ],
              name: [
                '"recent_holdings"."name"'
              ],
              tickersymbol: [
                '"recent_holdings"."tickersymbol"'
              ],
              orderbookid: [
                '"recent_holdings"."orderbookid"'
              ],
              type: [
                '"recent_holdings"."type"'
              ],
              date: [
                '"recent_holdings"."date"'
              ],
              prices_dates: [
                '"recent_holdings"."lastprice"',
                '"recent_holdings"."date"'
              ]
            }
          },
          command: {
            command: "sql-nav-link.openPath",
            title: "group_holding_day",
            arguments: [
              "e:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\group_holding_day.sql"
            ]
          }
        },
        refs: [
          {
            model: {
              collapsibleState: 1,
              label: "recent_holdings",
              name: "recent_holdings",
              file_name: "recent_holdings.sql",
              file_path: "e:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_holdings.sql",
              table_names: [
                {
                  fullname: '"postgres"."public"."holdings"',
                  name: "holdings",
                  db: "public",
                  catalog: "postgres",
                  alias: "holdings",
                  fields: [
                    "type",
                    "tickersymbol",
                    "name",
                    "value",
                    "lastprice",
                    "instrumentid",
                    "change",
                    "orderbookid",
                    "changepercent",
                    "averageacquiredprice",
                    "profitpercent",
                    "isin",
                    "acquiredvalue",
                    "volume",
                    "daylowestprice",
                    "accountid",
                    "averageacquiredpriceinstrumentcurrency",
                    "currency",
                    "accountname",
                    "date",
                    "dayhighestprice",
                    "profit"
                  ]
                }
              ],
              cte_names: [],
              columns: {
                accountid: [
                  '"postgres"."public"."holdings"."accountid"'
                ],
                accountname: [
                  '"postgres"."public"."holdings"."accountname"'
                ],
                volume: [
                  '"postgres"."public"."holdings"."volume"'
                ],
                value: [
                  '"postgres"."public"."holdings"."value"'
                ],
                acquiredvalue: [
                  '"postgres"."public"."holdings"."acquiredvalue"'
                ],
                averageacquiredprice: [
                  '"postgres"."public"."holdings"."averageacquiredprice"'
                ],
                averageacquiredpriceinstrumentcurrency: [
                  '"postgres"."public"."holdings"."averageacquiredpriceinstrumentcurrency"'
                ],
                profit: [
                  '"postgres"."public"."holdings"."profit"'
                ],
                profitpercent: [
                  '"postgres"."public"."holdings"."profitpercent"'
                ],
                instrumentid: [
                  '"postgres"."public"."holdings"."instrumentid"'
                ],
                name: [
                  '"postgres"."public"."holdings"."name"'
                ],
                isin: [
                  '"postgres"."public"."holdings"."isin"'
                ],
                tickersymbol: [
                  '"postgres"."public"."holdings"."tickersymbol"'
                ],
                currency: [
                  '"postgres"."public"."holdings"."currency"'
                ],
                orderbookid: [
                  '"postgres"."public"."holdings"."orderbookid"'
                ],
                type: [
                  '"postgres"."public"."holdings"."type"'
                ],
                lastprice: [
                  '"postgres"."public"."holdings"."lastprice"'
                ],
                change: [
                  '"postgres"."public"."holdings"."change"'
                ],
                changepercent: [
                  '"postgres"."public"."holdings"."changepercent"'
                ],
                dayhighestprice: [
                  '"postgres"."public"."holdings"."dayhighestprice"'
                ],
                daylowestprice: [
                  '"postgres"."public"."holdings"."daylowestprice"'
                ],
                date: [
                  '"postgres"."public"."holdings"."date"'
                ]
              },
              cte_columns: {},
              command: {
                command: "sql-nav-link.openPath",
                title: "recent_holdings",
                arguments: [
                  "e:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_holdings.sql"
                ]
              }
            },
            refs: [
              {
                model: {
                  fullname: '"postgres"."public"."holdings"',
                  name: "holdings",
                  db: "public",
                  catalog: "postgres",
                  alias: "holdings",
                  fields: [
                    "type",
                    "tickersymbol",
                    "name",
                    "value",
                    "lastprice",
                    "instrumentid",
                    "change",
                    "orderbookid",
                    "changepercent",
                    "averageacquiredprice",
                    "profitpercent",
                    "isin",
                    "acquiredvalue",
                    "volume",
                    "daylowestprice",
                    "accountid",
                    "averageacquiredpriceinstrumentcurrency",
                    "currency",
                    "accountname",
                    "date",
                    "dayhighestprice",
                    "profit"
                  ]
                },
                refs: [],
                fields: [
                  "type",
                  "tickersymbol",
                  "name",
                  "value",
                  "lastprice",
                  "instrumentid",
                  "change",
                  "orderbookid",
                  "changepercent",
                  "averageacquiredprice",
                  "profitpercent",
                  "isin",
                  "acquiredvalue",
                  "volume",
                  "daylowestprice",
                  "accountid",
                  "averageacquiredpriceinstrumentcurrency",
                  "currency",
                  "accountname",
                  "date",
                  "dayhighestprice",
                  "profit"
                ]
              }
            ],
            fields: [
              "tickersymbol",
              "name",
              "orderbookid",
              "date",
              "lastprice",
              "averageacquiredprice",
              "type",
              "instrumentid"
            ]
          }
        ],
        fields: [
          "tickersymbol",
          "name",
          "orderbookid",
          "averageacquiredprice",
          "type",
          "instrumentid",
          "prices_on_date"
        ]
      },
      {
        model: {
          collapsibleState: 1,
          label: "group_holding_day",
          name: "group_holding_day",
          file_name: "group_holding_day.sql",
          file_path: "e:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\group_holding_day.sql",
          table_names: [
            {
              fullname: '"recent_holdings"',
              name: "recent_holdings",
              db: "",
              catalog: "",
              alias: "recent_holdings",
              fields: [
                "tickersymbol",
                "name",
                "orderbookid",
                "date",
                "lastprice",
                "averageacquiredprice",
                "type",
                "instrumentid"
              ]
            }
          ],
          cte_names: [
            {
              fullname: '"agg_on_day"',
              name: "agg_on_day",
              db: "",
              catalog: "",
              alias: "agg_on_day",
              fields: [
                "tickersymbol",
                "name",
                "orderbookid",
                "date",
                "averageacquiredprice",
                "type",
                "prices_dates",
                "instrumentid"
              ]
            }
          ],
          columns: {
            averageacquiredprice: [
              '"agg_on_day"."averageacquiredprice"'
            ],
            instrumentid: [
              '"agg_on_day"."instrumentid"'
            ],
            name: [
              '"agg_on_day"."name"'
            ],
            tickersymbol: [
              '"agg_on_day"."tickersymbol"'
            ],
            orderbookid: [
              '"agg_on_day"."orderbookid"'
            ],
            type: [
              '"agg_on_day"."type"'
            ],
            prices_on_date: [
              '"agg_on_day"."date"',
              '"agg_on_day"."prices_dates"'
            ]
          },
          cte_columns: {
            agg_on_day: {
              averageacquiredprice: [
                '"recent_holdings"."averageacquiredprice"'
              ],
              instrumentid: [
                '"recent_holdings"."instrumentid"'
              ],
              name: [
                '"recent_holdings"."name"'
              ],
              tickersymbol: [
                '"recent_holdings"."tickersymbol"'
              ],
              orderbookid: [
                '"recent_holdings"."orderbookid"'
              ],
              type: [
                '"recent_holdings"."type"'
              ],
              date: [
                '"recent_holdings"."date"'
              ],
              prices_dates: [
                '"recent_holdings"."lastprice"',
                '"recent_holdings"."date"'
              ]
            }
          },
          command: {
            command: "sql-nav-link.openPath",
            title: "group_holding_day",
            arguments: [
              "e:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\group_holding_day.sql"
            ]
          }
        },
        refs: [
          {
            model: {
              collapsibleState: 1,
              label: "recent_holdings",
              name: "recent_holdings",
              file_name: "recent_holdings.sql",
              file_path: "e:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_holdings.sql",
              table_names: [
                {
                  fullname: '"postgres"."public"."holdings"',
                  name: "holdings",
                  db: "public",
                  catalog: "postgres",
                  alias: "holdings",
                  fields: [
                    "type",
                    "tickersymbol",
                    "name",
                    "value",
                    "lastprice",
                    "instrumentid",
                    "change",
                    "orderbookid",
                    "changepercent",
                    "averageacquiredprice",
                    "profitpercent",
                    "isin",
                    "acquiredvalue",
                    "volume",
                    "daylowestprice",
                    "accountid",
                    "averageacquiredpriceinstrumentcurrency",
                    "currency",
                    "accountname",
                    "date",
                    "dayhighestprice",
                    "profit"
                  ]
                }
              ],
              cte_names: [],
              columns: {
                accountid: [
                  '"postgres"."public"."holdings"."accountid"'
                ],
                accountname: [
                  '"postgres"."public"."holdings"."accountname"'
                ],
                volume: [
                  '"postgres"."public"."holdings"."volume"'
                ],
                value: [
                  '"postgres"."public"."holdings"."value"'
                ],
                acquiredvalue: [
                  '"postgres"."public"."holdings"."acquiredvalue"'
                ],
                averageacquiredprice: [
                  '"postgres"."public"."holdings"."averageacquiredprice"'
                ],
                averageacquiredpriceinstrumentcurrency: [
                  '"postgres"."public"."holdings"."averageacquiredpriceinstrumentcurrency"'
                ],
                profit: [
                  '"postgres"."public"."holdings"."profit"'
                ],
                profitpercent: [
                  '"postgres"."public"."holdings"."profitpercent"'
                ],
                instrumentid: [
                  '"postgres"."public"."holdings"."instrumentid"'
                ],
                name: [
                  '"postgres"."public"."holdings"."name"'
                ],
                isin: [
                  '"postgres"."public"."holdings"."isin"'
                ],
                tickersymbol: [
                  '"postgres"."public"."holdings"."tickersymbol"'
                ],
                currency: [
                  '"postgres"."public"."holdings"."currency"'
                ],
                orderbookid: [
                  '"postgres"."public"."holdings"."orderbookid"'
                ],
                type: [
                  '"postgres"."public"."holdings"."type"'
                ],
                lastprice: [
                  '"postgres"."public"."holdings"."lastprice"'
                ],
                change: [
                  '"postgres"."public"."holdings"."change"'
                ],
                changepercent: [
                  '"postgres"."public"."holdings"."changepercent"'
                ],
                dayhighestprice: [
                  '"postgres"."public"."holdings"."dayhighestprice"'
                ],
                daylowestprice: [
                  '"postgres"."public"."holdings"."daylowestprice"'
                ],
                date: [
                  '"postgres"."public"."holdings"."date"'
                ]
              },
              cte_columns: {},
              command: {
                command: "sql-nav-link.openPath",
                title: "recent_holdings",
                arguments: [
                  "e:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_holdings.sql"
                ]
              }
            },
            refs: [
              {
                model: {
                  fullname: '"postgres"."public"."holdings"',
                  name: "holdings",
                  db: "public",
                  catalog: "postgres",
                  alias: "holdings",
                  fields: [
                    "type",
                    "tickersymbol",
                    "name",
                    "value",
                    "lastprice",
                    "instrumentid",
                    "change",
                    "orderbookid",
                    "changepercent",
                    "averageacquiredprice",
                    "profitpercent",
                    "isin",
                    "acquiredvalue",
                    "volume",
                    "daylowestprice",
                    "accountid",
                    "averageacquiredpriceinstrumentcurrency",
                    "currency",
                    "accountname",
                    "date",
                    "dayhighestprice",
                    "profit"
                  ]
                },
                refs: [],
                fields: [
                  "type",
                  "tickersymbol",
                  "name",
                  "value",
                  "lastprice",
                  "instrumentid",
                  "change",
                  "orderbookid",
                  "changepercent",
                  "averageacquiredprice",
                  "profitpercent",
                  "isin",
                  "acquiredvalue",
                  "volume",
                  "daylowestprice",
                  "accountid",
                  "averageacquiredpriceinstrumentcurrency",
                  "currency",
                  "accountname",
                  "date",
                  "dayhighestprice",
                  "profit"
                ]
              }
            ],
            fields: [
              "tickersymbol",
              "name",
              "orderbookid",
              "date",
              "lastprice",
              "averageacquiredprice",
              "type",
              "instrumentid"
            ]
          }
        ],
        fields: [
          "orderbookid",
          "prices_on_date"
        ]
      },
      {
        model: {
          fullname: '"postgres"."public"."bors_info"',
          name: "bors_info",
          db: "public",
          catalog: "postgres",
          alias: "bi",
          fields: [
            "orderbookid",
            "instid"
          ]
        },
        refs: [],
        fields: [
          "orderbookid",
          "instid"
        ]
      },
      {
        model: {
          collapsibleState: 1,
          label: "last_two_week_prices",
          name: "last_two_week_prices",
          file_name: "last_two_week_prices.sql",
          file_path: "e:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\last_two_week_prices.sql",
          table_names: [
            {
              fullname: '"recent_prices"',
              name: "recent_prices",
              db: "",
              catalog: "",
              alias: "recent_prices",
              fields: [
                "trade_date",
                "close_price",
                "low_price",
                "ins_id",
                "open_price",
                "high_price"
              ]
            }
          ],
          cte_names: [],
          columns: {
            ins_id: [
              '"recent_prices"."ins_id"'
            ],
            price_data: [
              '"recent_prices"."trade_date"',
              '"recent_prices"."low_price"',
              '"recent_prices"."close_price"',
              '"recent_prices"."open_price"',
              '"recent_prices"."high_price"'
            ]
          },
          cte_columns: {},
          command: {
            command: "sql-nav-link.openPath",
            title: "last_two_week_prices",
            arguments: [
              "e:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\last_two_week_prices.sql"
            ]
          }
        },
        refs: [
          {
            model: {
              collapsibleState: 1,
              label: "recent_prices",
              name: "recent_prices",
              file_name: "recent_prices.sql",
              file_path: "e:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_prices.sql",
              table_names: [
                {
                  fullname: '"postgres"."public"."bors_prices"',
                  name: "bors_prices",
                  db: "public",
                  catalog: "postgres",
                  alias: "bors_prices",
                  fields: [
                    "volume",
                    "trade_date",
                    "close_price",
                    "low_price",
                    "ins_id",
                    "open_price",
                    "high_price"
                  ]
                }
              ],
              cte_names: [],
              columns: {
                trade_date: [
                  '"postgres"."public"."bors_prices"."trade_date"'
                ],
                ins_id: [
                  '"postgres"."public"."bors_prices"."ins_id"'
                ],
                high_price: [
                  '"postgres"."public"."bors_prices"."high_price"'
                ],
                low_price: [
                  '"postgres"."public"."bors_prices"."low_price"'
                ],
                open_price: [
                  '"postgres"."public"."bors_prices"."open_price"'
                ],
                close_price: [
                  '"postgres"."public"."bors_prices"."close_price"'
                ],
                volume: [
                  '"postgres"."public"."bors_prices"."volume"'
                ]
              },
              cte_columns: {},
              command: {
                command: "sql-nav-link.openPath",
                title: "recent_prices",
                arguments: [
                  "e:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_prices.sql"
                ]
              }
            },
            refs: [
              {
                model: {
                  fullname: '"postgres"."public"."bors_prices"',
                  name: "bors_prices",
                  db: "public",
                  catalog: "postgres",
                  alias: "bors_prices",
                  fields: [
                    "volume",
                    "trade_date",
                    "close_price",
                    "low_price",
                    "ins_id",
                    "open_price",
                    "high_price"
                  ]
                },
                refs: [],
                fields: [
                  "volume",
                  "trade_date",
                  "close_price",
                  "low_price",
                  "ins_id",
                  "open_price",
                  "high_price"
                ]
              }
            ],
            fields: [
              "trade_date",
              "close_price",
              "low_price",
              "ins_id",
              "open_price",
              "high_price"
            ]
          }
        ],
        fields: [
          "price_data",
          "ins_id"
        ]
      }
    ],
    rightRefs: [],
    size_left: "3",
    size_right: "2"
  };

  // lineageViewerTS/src/main.ts
  var vscode2 = getVsCodeApi();
  document.addEventListener("DOMContentLoaded", () => {
    renderLineage(testData);
  });
})();
//# sourceMappingURL=index.js.map
