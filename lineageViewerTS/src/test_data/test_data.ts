


export const testData = {
  centerModel: {
    model: {
      collapsibleState: 1,
      label: "group_day_holding_with_bors",
      name: "group_day_holding_with_bors",
      file_name: "group_day_holding_with_bors.sql",
      file_path: "e:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\group_day_holding_with_bors.sql",
      table_names: [
        {
          fullname: "\"group_holding_day\"",
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
            "prices_on_date",
          ],
        },
        {
          fullname: "\"group_holding_day\"",
          name: "group_holding_day",
          db: "",
          catalog: "",
          alias: "ghp",
          fields: [
            "orderbookid",
            "prices_on_date",
          ],
        },
        {
          fullname: "\"postgres\".\"public\".\"bors_info\"",
          name: "bors_info",
          db: "public",
          catalog: "postgres",
          alias: "bi",
          fields: [
            "orderbookid",
            "instid",
          ],
        },
        {
          fullname: "\"last_two_week_prices\"",
          name: "last_two_week_prices",
          db: "",
          catalog: "",
          alias: "lwp",
          fields: [
            "price_data",
            "ins_id",
          ],
        },
      ],
      cte_names: [
        {
          fullname: "\"daily_stats\"",
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
            "low_p",
          ],
        },
        {
          fullname: "\"calculated_backup\"",
          name: "calculated_backup",
          db: "",
          catalog: "",
          alias: "cb",
          fields: [
            "orderbookid",
            "generated_price_data",
          ],
        },
      ],
      columns: {
        averageacquiredprice: [
          "\"group_holding_day\".\"averageacquiredprice\"",
        ],
        instrumentid: [
          "\"group_holding_day\".\"instrumentid\"",
        ],
        name: [
          "\"group_holding_day\".\"name\"",
        ],
        tickersymbol: [
          "\"group_holding_day\".\"tickersymbol\"",
        ],
        orderbookid: [
          "\"group_holding_day\".\"orderbookid\"",
        ],
        prices_on_date: [
          "\"group_holding_day\".\"prices_on_date\"",
        ],
        type: [
          "\"group_holding_day\".\"type\"",
        ],
        instid: [
          "\"postgres\".\"public\".\"bors_info\".\"instid\"",
        ],
        price_data: [
          "\"last_two_week_prices\".\"price_data\"",
          "\"calculated_backup\".\"generated_price_data\"",
        ],
      },
      cte_columns: {
        daily_stats: {
          orderbookid: [
            "\"group_holding_day\".\"orderbookid\"",
          ],
          r_date: [
            "\"group_holding_day\".\"day_data\"",
          ],
          low_p: [
            "\"group_holding_day\".\"p_entry\"",
          ],
          high_p: [
            "\"group_holding_day\".\"p_entry\"",
          ],
          open_p: [
            "\"group_holding_day\".\"p_entry\"",
          ],
          close_p: [
            "\"group_holding_day\".\"p_entry\"",
          ],
        },
        calculated_backup: {
          orderbookid: [
            "\"daily_stats\".\"orderbookid\"",
          ],
          generated_price_data: [
            "\"daily_stats\".\"high_p\"",
            "\"daily_stats\".\"r_date\"",
            "\"daily_stats\".\"close_p\"",
            "\"daily_stats\".\"low_p\"",
            "\"daily_stats\".\"open_p\"",
          ],
        },
      },
      command: {
        command: "sql-nav-link.openPath",
        title: "group_day_holding_with_bors",
        arguments: [
          "e:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\group_day_holding_with_bors.sql",
        ],
      },
    },
    refs: [
    ],
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
            fullname: "\"recent_holdings\"",
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
              "instrumentid",
            ],
          },
        ],
        cte_names: [
          {
            fullname: "\"agg_on_day\"",
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
              "instrumentid",
            ],
          },
        ],
        columns: {
          averageacquiredprice: [
            "\"agg_on_day\".\"averageacquiredprice\"",
          ],
          instrumentid: [
            "\"agg_on_day\".\"instrumentid\"",
          ],
          name: [
            "\"agg_on_day\".\"name\"",
          ],
          tickersymbol: [
            "\"agg_on_day\".\"tickersymbol\"",
          ],
          orderbookid: [
            "\"agg_on_day\".\"orderbookid\"",
          ],
          type: [
            "\"agg_on_day\".\"type\"",
          ],
          prices_on_date: [
            "\"agg_on_day\".\"date\"",
            "\"agg_on_day\".\"prices_dates\"",
          ],
        },
        cte_columns: {
          agg_on_day: {
            averageacquiredprice: [
              "\"recent_holdings\".\"averageacquiredprice\"",
            ],
            instrumentid: [
              "\"recent_holdings\".\"instrumentid\"",
            ],
            name: [
              "\"recent_holdings\".\"name\"",
            ],
            tickersymbol: [
              "\"recent_holdings\".\"tickersymbol\"",
            ],
            orderbookid: [
              "\"recent_holdings\".\"orderbookid\"",
            ],
            type: [
              "\"recent_holdings\".\"type\"",
            ],
            date: [
              "\"recent_holdings\".\"date\"",
            ],
            prices_dates: [
              "\"recent_holdings\".\"lastprice\"",
              "\"recent_holdings\".\"date\"",
            ],
          },
        },
        command: {
          command: "sql-nav-link.openPath",
          title: "group_holding_day",
          arguments: [
            "e:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\group_holding_day.sql",
          ],
        },
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
                fullname: "\"postgres\".\"public\".\"holdings\"",
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
                  "profit",
                ],
              },
            ],
            cte_names: [
            ],
            columns: {
              accountid: [
                "\"postgres\".\"public\".\"holdings\".\"accountid\"",
              ],
              accountname: [
                "\"postgres\".\"public\".\"holdings\".\"accountname\"",
              ],
              volume: [
                "\"postgres\".\"public\".\"holdings\".\"volume\"",
              ],
              value: [
                "\"postgres\".\"public\".\"holdings\".\"value\"",
              ],
              acquiredvalue: [
                "\"postgres\".\"public\".\"holdings\".\"acquiredvalue\"",
              ],
              averageacquiredprice: [
                "\"postgres\".\"public\".\"holdings\".\"averageacquiredprice\"",
              ],
              averageacquiredpriceinstrumentcurrency: [
                "\"postgres\".\"public\".\"holdings\".\"averageacquiredpriceinstrumentcurrency\"",
              ],
              profit: [
                "\"postgres\".\"public\".\"holdings\".\"profit\"",
              ],
              profitpercent: [
                "\"postgres\".\"public\".\"holdings\".\"profitpercent\"",
              ],
              instrumentid: [
                "\"postgres\".\"public\".\"holdings\".\"instrumentid\"",
              ],
              name: [
                "\"postgres\".\"public\".\"holdings\".\"name\"",
              ],
              isin: [
                "\"postgres\".\"public\".\"holdings\".\"isin\"",
              ],
              tickersymbol: [
                "\"postgres\".\"public\".\"holdings\".\"tickersymbol\"",
              ],
              currency: [
                "\"postgres\".\"public\".\"holdings\".\"currency\"",
              ],
              orderbookid: [
                "\"postgres\".\"public\".\"holdings\".\"orderbookid\"",
              ],
              type: [
                "\"postgres\".\"public\".\"holdings\".\"type\"",
              ],
              lastprice: [
                "\"postgres\".\"public\".\"holdings\".\"lastprice\"",
              ],
              change: [
                "\"postgres\".\"public\".\"holdings\".\"change\"",
              ],
              changepercent: [
                "\"postgres\".\"public\".\"holdings\".\"changepercent\"",
              ],
              dayhighestprice: [
                "\"postgres\".\"public\".\"holdings\".\"dayhighestprice\"",
              ],
              daylowestprice: [
                "\"postgres\".\"public\".\"holdings\".\"daylowestprice\"",
              ],
              date: [
                "\"postgres\".\"public\".\"holdings\".\"date\"",
              ],
            },
            cte_columns: {
            },
            command: {
              command: "sql-nav-link.openPath",
              title: "recent_holdings",
              arguments: [
                "e:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_holdings.sql",
              ],
            },
          },
          refs: [
            {
              model: {
                fullname: "\"postgres\".\"public\".\"holdings\"",
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
                  "profit",
                ],
              },
              refs: [
              ],
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
                "profit",
              ],
            },
          ],
          fields: [
            "tickersymbol",
            "name",
            "orderbookid",
            "date",
            "lastprice",
            "averageacquiredprice",
            "type",
            "instrumentid",
          ],
        },
      ],
      fields: [
        "tickersymbol",
        "name",
        "orderbookid",
        "averageacquiredprice",
        "type",
        "instrumentid",
        "prices_on_date",
      ],
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
            fullname: "\"recent_holdings\"",
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
              "instrumentid",
            ],
          },
        ],
        cte_names: [
          {
            fullname: "\"agg_on_day\"",
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
              "instrumentid",
            ],
          },
        ],
        columns: {
          averageacquiredprice: [
            "\"agg_on_day\".\"averageacquiredprice\"",
          ],
          instrumentid: [
            "\"agg_on_day\".\"instrumentid\"",
          ],
          name: [
            "\"agg_on_day\".\"name\"",
          ],
          tickersymbol: [
            "\"agg_on_day\".\"tickersymbol\"",
          ],
          orderbookid: [
            "\"agg_on_day\".\"orderbookid\"",
          ],
          type: [
            "\"agg_on_day\".\"type\"",
          ],
          prices_on_date: [
            "\"agg_on_day\".\"date\"",
            "\"agg_on_day\".\"prices_dates\"",
          ],
        },
        cte_columns: {
          agg_on_day: {
            averageacquiredprice: [
              "\"recent_holdings\".\"averageacquiredprice\"",
            ],
            instrumentid: [
              "\"recent_holdings\".\"instrumentid\"",
            ],
            name: [
              "\"recent_holdings\".\"name\"",
            ],
            tickersymbol: [
              "\"recent_holdings\".\"tickersymbol\"",
            ],
            orderbookid: [
              "\"recent_holdings\".\"orderbookid\"",
            ],
            type: [
              "\"recent_holdings\".\"type\"",
            ],
            date: [
              "\"recent_holdings\".\"date\"",
            ],
            prices_dates: [
              "\"recent_holdings\".\"lastprice\"",
              "\"recent_holdings\".\"date\"",
            ],
          },
        },
        command: {
          command: "sql-nav-link.openPath",
          title: "group_holding_day",
          arguments: [
            "e:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\group_holding_day.sql",
          ],
        },
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
                fullname: "\"postgres\".\"public\".\"holdings\"",
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
                  "profit",
                ],
              },
            ],
            cte_names: [
            ],
            columns: {
              accountid: [
                "\"postgres\".\"public\".\"holdings\".\"accountid\"",
              ],
              accountname: [
                "\"postgres\".\"public\".\"holdings\".\"accountname\"",
              ],
              volume: [
                "\"postgres\".\"public\".\"holdings\".\"volume\"",
              ],
              value: [
                "\"postgres\".\"public\".\"holdings\".\"value\"",
              ],
              acquiredvalue: [
                "\"postgres\".\"public\".\"holdings\".\"acquiredvalue\"",
              ],
              averageacquiredprice: [
                "\"postgres\".\"public\".\"holdings\".\"averageacquiredprice\"",
              ],
              averageacquiredpriceinstrumentcurrency: [
                "\"postgres\".\"public\".\"holdings\".\"averageacquiredpriceinstrumentcurrency\"",
              ],
              profit: [
                "\"postgres\".\"public\".\"holdings\".\"profit\"",
              ],
              profitpercent: [
                "\"postgres\".\"public\".\"holdings\".\"profitpercent\"",
              ],
              instrumentid: [
                "\"postgres\".\"public\".\"holdings\".\"instrumentid\"",
              ],
              name: [
                "\"postgres\".\"public\".\"holdings\".\"name\"",
              ],
              isin: [
                "\"postgres\".\"public\".\"holdings\".\"isin\"",
              ],
              tickersymbol: [
                "\"postgres\".\"public\".\"holdings\".\"tickersymbol\"",
              ],
              currency: [
                "\"postgres\".\"public\".\"holdings\".\"currency\"",
              ],
              orderbookid: [
                "\"postgres\".\"public\".\"holdings\".\"orderbookid\"",
              ],
              type: [
                "\"postgres\".\"public\".\"holdings\".\"type\"",
              ],
              lastprice: [
                "\"postgres\".\"public\".\"holdings\".\"lastprice\"",
              ],
              change: [
                "\"postgres\".\"public\".\"holdings\".\"change\"",
              ],
              changepercent: [
                "\"postgres\".\"public\".\"holdings\".\"changepercent\"",
              ],
              dayhighestprice: [
                "\"postgres\".\"public\".\"holdings\".\"dayhighestprice\"",
              ],
              daylowestprice: [
                "\"postgres\".\"public\".\"holdings\".\"daylowestprice\"",
              ],
              date: [
                "\"postgres\".\"public\".\"holdings\".\"date\"",
              ],
            },
            cte_columns: {
            },
            command: {
              command: "sql-nav-link.openPath",
              title: "recent_holdings",
              arguments: [
                "e:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_holdings.sql",
              ],
            },
          },
          refs: [
            {
              model: {
                fullname: "\"postgres\".\"public\".\"holdings\"",
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
                  "profit",
                ],
              },
              refs: [
              ],
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
                "profit",
              ],
            },
          ],
          fields: [
            "tickersymbol",
            "name",
            "orderbookid",
            "date",
            "lastprice",
            "averageacquiredprice",
            "type",
            "instrumentid",
          ],
        },
      ],
      fields: [
        "orderbookid",
        "prices_on_date",
      ],
    },
    {
      model: {
        fullname: "\"postgres\".\"public\".\"bors_info\"",
        name: "bors_info",
        db: "public",
        catalog: "postgres",
        alias: "bi",
        fields: [
          "orderbookid",
          "instid",
        ],
      },
      refs: [
      ],
      fields: [
        "orderbookid",
        "instid",
      ],
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
            fullname: "\"recent_prices\"",
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
              "high_price",
            ],
          },
        ],
        cte_names: [
        ],
        columns: {
          ins_id: [
            "\"recent_prices\".\"ins_id\"",
          ],
          price_data: [
            "\"recent_prices\".\"trade_date\"",
            "\"recent_prices\".\"low_price\"",
            "\"recent_prices\".\"close_price\"",
            "\"recent_prices\".\"open_price\"",
            "\"recent_prices\".\"high_price\"",
          ],
        },
        cte_columns: {
        },
        command: {
          command: "sql-nav-link.openPath",
          title: "last_two_week_prices",
          arguments: [
            "e:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\last_two_week_prices.sql",
          ],
        },
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
                fullname: "\"postgres\".\"public\".\"bors_prices\"",
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
                  "high_price",
                ],
              },
            ],
            cte_names: [
            ],
            columns: {
              trade_date: [
                "\"postgres\".\"public\".\"bors_prices\".\"trade_date\"",
              ],
              ins_id: [
                "\"postgres\".\"public\".\"bors_prices\".\"ins_id\"",
              ],
              high_price: [
                "\"postgres\".\"public\".\"bors_prices\".\"high_price\"",
              ],
              low_price: [
                "\"postgres\".\"public\".\"bors_prices\".\"low_price\"",
              ],
              open_price: [
                "\"postgres\".\"public\".\"bors_prices\".\"open_price\"",
              ],
              close_price: [
                "\"postgres\".\"public\".\"bors_prices\".\"close_price\"",
              ],
              volume: [
                "\"postgres\".\"public\".\"bors_prices\".\"volume\"",
              ],
            },
            cte_columns: {
            },
            command: {
              command: "sql-nav-link.openPath",
              title: "recent_prices",
              arguments: [
                "e:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_prices.sql",
              ],
            },
          },
          refs: [
            {
              model: {
                fullname: "\"postgres\".\"public\".\"bors_prices\"",
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
                  "high_price",
                ],
              },
              refs: [
              ],
              fields: [
                "volume",
                "trade_date",
                "close_price",
                "low_price",
                "ins_id",
                "open_price",
                "high_price",
              ],
            },
          ],
          fields: [
            "trade_date",
            "close_price",
            "low_price",
            "ins_id",
            "open_price",
            "high_price",
          ],
        },
      ],
      fields: [
        "price_data",
        "ins_id",
      ],
    },
  ],
  rightRefs: [
  ],
  size_left: "3",
  size_right: "2",
}