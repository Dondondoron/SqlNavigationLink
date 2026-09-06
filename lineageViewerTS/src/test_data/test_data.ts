

export const testDataReverse = {
    "centerModel": {
        "model": {
            "collapsibleState": 1,
            "label": "\"recent_prices\"",
            "name": "\"recent_prices\"",
            "file_name": "recent_prices.sql",
            "file_path": "e:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_prices.sql",
            "table_names": [
                "public.postgres.bors_prices"
            ],
            "columns": [
                {
                    "name": "trade_date",
                    "table": "\"recent_prices\"",
                    "refs": [
                        {
                            "name": "trade_date",
                            "table": "public.postgres.bors_prices",
                            "refs": []
                        }
                    ]
                },
                {
                    "name": "ins_id",
                    "table": "\"recent_prices\"",
                    "refs": [
                        {
                            "name": "ins_id",
                            "table": "public.postgres.bors_prices",
                            "refs": []
                        }
                    ]
                },
                {
                    "name": "high_price",
                    "table": "\"recent_prices\"",
                    "refs": [
                        {
                            "name": "high_price",
                            "table": "public.postgres.bors_prices",
                            "refs": []
                        }
                    ]
                },
                {
                    "name": "low_price",
                    "table": "\"recent_prices\"",
                    "refs": [
                        {
                            "name": "low_price",
                            "table": "public.postgres.bors_prices",
                            "refs": []
                        }
                    ]
                },
                {
                    "name": "open_price",
                    "table": "\"recent_prices\"",
                    "refs": [
                        {
                            "name": "open_price",
                            "table": "public.postgres.bors_prices",
                            "refs": []
                        }
                    ]
                },
                {
                    "name": "close_price",
                    "table": "\"recent_prices\"",
                    "refs": [
                        {
                            "name": "close_price",
                            "table": "public.postgres.bors_prices",
                            "refs": []
                        }
                    ]
                },
                {
                    "name": "volume",
                    "table": "\"recent_prices\"",
                    "refs": [
                        {
                            "name": "volume",
                            "table": "public.postgres.bors_prices",
                            "refs": []
                        }
                    ]
                }
            ],
            "command": {
                "command": "sql-nav-link.openPath",
                "title": "\"recent_prices\"",
                "arguments": [
                    "e:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_prices.sql"
                ]
            }
        },
        "refs": [
            {
                "model": {
                    "name": "public.postgres.bors_prices",
                    "file_name": "",
                    "file_path": "",
                    "table_names": [],
                    "columns": [
                        {
                            "name": "trade_date",
                            "table": "public.postgres.bors_prices",
                            "refs": []
                        },
                        {
                            "name": "ins_id",
                            "table": "public.postgres.bors_prices",
                            "refs": []
                        },
                        {
                            "name": "high_price",
                            "table": "public.postgres.bors_prices",
                            "refs": []
                        },
                        {
                            "name": "low_price",
                            "table": "public.postgres.bors_prices",
                            "refs": []
                        },
                        {
                            "name": "open_price",
                            "table": "public.postgres.bors_prices",
                            "refs": []
                        },
                        {
                            "name": "close_price",
                            "table": "public.postgres.bors_prices",
                            "refs": []
                        },
                        {
                            "name": "volume",
                            "table": "public.postgres.bors_prices",
                            "refs": []
                        }
                    ]
                },
                "refs": [],
                "fields": []
            }
        ]
    },
    "rightRefs": [
        {
            "model": {
                "collapsibleState": 1,
                "label": "\"last_two_week_prices\"",
                "name": "\"last_two_week_prices\"",
                "file_name": "last_two_week_prices.sql",
                "file_path": "e:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\last_two_week_prices.sql",
                "table_names": [
                    "recent_prices"
                ],
                "columns": [
                    {
                        "name": "ins_id",
                        "table": "\"last_two_week_prices\"",
                        "refs": [
                            {
                                "name": "ins_id",
                                "table": "recent_prices",
                                "refs": []
                            }
                        ]
                    },
                    {
                        "name": "price_data",
                        "table": "\"last_two_week_prices\"",
                        "refs": [
                            {
                                "name": "arrayagg",
                                "refs": [
                                    {
                                        "name": "JSONB_BUILD_OBJECT",
                                        "refs": [
                                            {
                                                "name": "literal:date",
                                                "refs": []
                                            },
                                            {
                                                "name": "trade_date",
                                                "table": "recent_prices",
                                                "refs": []
                                            },
                                            {
                                                "name": "literal:high_price",
                                                "refs": []
                                            },
                                            {
                                                "name": "high_price",
                                                "table": "recent_prices",
                                                "refs": []
                                            },
                                            {
                                                "name": "literal:low_price",
                                                "refs": []
                                            },
                                            {
                                                "name": "low_price",
                                                "table": "recent_prices",
                                                "refs": []
                                            },
                                            {
                                                "name": "literal:close_price",
                                                "refs": []
                                            },
                                            {
                                                "name": "close_price",
                                                "table": "recent_prices",
                                                "refs": []
                                            },
                                            {
                                                "name": "literal:open_price",
                                                "refs": []
                                            },
                                            {
                                                "name": "open_price",
                                                "table": "recent_prices",
                                                "refs": []
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "command": {
                    "command": "sql-nav-link.openPath",
                    "title": "\"last_two_week_prices\"",
                    "arguments": [
                        "e:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\last_two_week_prices.sql"
                    ]
                }
            },
            "refs": [
                {
                    "model": {
                        "collapsibleState": 1,
                        "label": "\"last_two_week_holdings\"",
                        "name": "\"last_two_week_holdings\"",
                        "file_name": "last_two_week_holdings.sql",
                        "file_path": "e:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\last_two_week_holdings.sql",
                        "table_names": [
                            "public.postgres.bors_info",
                            "grouped_holdings",
                            "last_two_week_prices"
                        ],
                        "columns": [
                            {
                                "name": "instrumentid",
                                "table": "\"last_two_week_holdings\"",
                                "refs": [
                                    {
                                        "name": "instrumentid",
                                        "table": "grouped_holdings",
                                        "refs": []
                                    }
                                ]
                            },
                            {
                                "name": "orderbookid",
                                "table": "\"last_two_week_holdings\"",
                                "refs": [
                                    {
                                        "name": "orderbookid",
                                        "table": "grouped_holdings",
                                        "refs": []
                                    }
                                ]
                            },
                            {
                                "name": "name",
                                "table": "\"last_two_week_holdings\"",
                                "refs": [
                                    {
                                        "name": "name",
                                        "table": "grouped_holdings",
                                        "refs": []
                                    }
                                ]
                            },
                            {
                                "name": "tickersymbol",
                                "table": "\"last_two_week_holdings\"",
                                "refs": [
                                    {
                                        "name": "tickersymbol",
                                        "table": "grouped_holdings",
                                        "refs": []
                                    }
                                ]
                            },
                            {
                                "name": "type",
                                "table": "\"last_two_week_holdings\"",
                                "refs": [
                                    {
                                        "name": "type",
                                        "table": "grouped_holdings",
                                        "refs": []
                                    }
                                ]
                            },
                            {
                                "name": "averageacquiredprice",
                                "table": "\"last_two_week_holdings\"",
                                "refs": [
                                    {
                                        "name": "averageacquiredprice",
                                        "table": "grouped_holdings",
                                        "refs": []
                                    }
                                ]
                            },
                            {
                                "name": "ins_id",
                                "table": "\"last_two_week_holdings\"",
                                "refs": [
                                    {
                                        "name": "ins_id",
                                        "table": "last_two_week_prices",
                                        "refs": []
                                    }
                                ]
                            },
                            {
                                "name": "price_data",
                                "table": "\"last_two_week_holdings\"",
                                "refs": [
                                    {
                                        "name": "price_data",
                                        "table": "last_two_week_prices",
                                        "refs": []
                                    }
                                ]
                            }
                        ],
                        "command": {
                            "command": "sql-nav-link.openPath",
                            "title": "\"last_two_week_holdings\"",
                            "arguments": [
                                "e:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\last_two_week_holdings.sql"
                            ]
                        }
                    },
                    "refs": [],
                    "fields": []
                },
                {
                    "model": {
                        "collapsibleState": 1,
                        "label": "\"group_day_holding_with_bors\"",
                        "name": "\"group_day_holding_with_bors\"",
                        "file_name": "group_day_holding_with_bors.sql",
                        "file_path": "e:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\group_day_holding_with_bors.sql",
                        "table_names": [
                            "public.postgres.bors_info",
                            "group_holding_day",
                            "last_two_week_prices"
                        ],
                        "columns": [
                            {
                                "name": "averageacquiredprice",
                                "table": "\"group_day_holding_with_bors\"",
                                "refs": [
                                    {
                                        "name": "averageacquiredprice",
                                        "table": "group_holding_day",
                                        "refs": []
                                    }
                                ]
                            },
                            {
                                "name": "instrumentid",
                                "table": "\"group_day_holding_with_bors\"",
                                "refs": [
                                    {
                                        "name": "instrumentid",
                                        "table": "group_holding_day",
                                        "refs": []
                                    }
                                ]
                            },
                            {
                                "name": "name",
                                "table": "\"group_day_holding_with_bors\"",
                                "refs": [
                                    {
                                        "name": "name",
                                        "table": "group_holding_day",
                                        "refs": []
                                    }
                                ]
                            },
                            {
                                "name": "tickersymbol",
                                "table": "\"group_day_holding_with_bors\"",
                                "refs": [
                                    {
                                        "name": "tickersymbol",
                                        "table": "group_holding_day",
                                        "refs": []
                                    }
                                ]
                            },
                            {
                                "name": "orderbookid",
                                "table": "\"group_day_holding_with_bors\"",
                                "refs": [
                                    {
                                        "name": "orderbookid",
                                        "table": "group_holding_day",
                                        "refs": []
                                    }
                                ]
                            },
                            {
                                "name": "prices_on_date",
                                "table": "\"group_day_holding_with_bors\"",
                                "refs": [
                                    {
                                        "name": "prices_on_date",
                                        "table": "group_holding_day",
                                        "refs": []
                                    }
                                ]
                            },
                            {
                                "name": "type",
                                "table": "\"group_day_holding_with_bors\"",
                                "refs": [
                                    {
                                        "name": "type",
                                        "table": "group_holding_day",
                                        "refs": []
                                    }
                                ]
                            },
                            {
                                "name": "instid",
                                "table": "\"group_day_holding_with_bors\"",
                                "refs": [
                                    {
                                        "name": "instid",
                                        "table": "public.postgres.bors_info",
                                        "refs": []
                                    }
                                ]
                            },
                            {
                                "name": "price_data",
                                "table": "\"group_day_holding_with_bors\"",
                                "refs": [
                                    {
                                        "name": "coalesce",
                                        "refs": [
                                            {
                                                "name": "to_jsonb",
                                                "refs": [
                                                    {
                                                        "name": "price_data",
                                                        "table": "last_two_week_prices",
                                                        "refs": []
                                                    }
                                                ]
                                            },
                                            {
                                                "name": "cast",
                                                "refs": [
                                                    {
                                                        "name": "generated_price_data",
                                                        "table": "calculated_backup",
                                                        "refs": [
                                                            {
                                                                "name": "generated_price_data",
                                                                "table": "calculated_backup",
                                                                "refs": [
                                                                    {
                                                                        "name": "jsonb_agg",
                                                                        "refs": [
                                                                            {
                                                                                "name": "order",
                                                                                "refs": [
                                                                                    {
                                                                                        "name": "jsonb_build_object",
                                                                                        "refs": [
                                                                                            {
                                                                                                "name": "literal:date",
                                                                                                "refs": []
                                                                                            },
                                                                                            {
                                                                                                "name": "r_date",
                                                                                                "table": "daily_stats",
                                                                                                "refs": [
                                                                                                    {
                                                                                                        "name": "r_date",
                                                                                                        "table": "daily_stats",
                                                                                                        "refs": [
                                                                                                            {
                                                                                                                "name": "jsonextractscalar",
                                                                                                                "refs": [
                                                                                                                    {
                                                                                                                        "name": "day_data",
                                                                                                                        "table": "group_holding_day",
                                                                                                                        "refs": []
                                                                                                                    },
                                                                                                                    {
                                                                                                                        "name": "jsonpath",
                                                                                                                        "refs": [
                                                                                                                            {
                                                                                                                                "name": "jsonpathroot",
                                                                                                                                "refs": []
                                                                                                                            },
                                                                                                                            {
                                                                                                                                "name": "jsonpathkey",
                                                                                                                                "refs": []
                                                                                                                            }
                                                                                                                        ]
                                                                                                                    }
                                                                                                                ]
                                                                                                            }
                                                                                                        ]
                                                                                                    }
                                                                                                ]
                                                                                            },
                                                                                            {
                                                                                                "name": "literal:low_price",
                                                                                                "refs": []
                                                                                            },
                                                                                            {
                                                                                                "name": "low_p",
                                                                                                "table": "daily_stats",
                                                                                                "refs": [
                                                                                                    {
                                                                                                        "name": "low_p",
                                                                                                        "table": "daily_stats",
                                                                                                        "refs": [
                                                                                                            {
                                                                                                                "name": "min",
                                                                                                                "refs": [
                                                                                                                    {
                                                                                                                        "name": "cast",
                                                                                                                        "refs": [
                                                                                                                            {
                                                                                                                                "name": "jsonextractscalar",
                                                                                                                                "refs": [
                                                                                                                                    {
                                                                                                                                        "name": "p_entry",
                                                                                                                                        "table": "group_holding_day",
                                                                                                                                        "refs": []
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                        "name": "jsonpath",
                                                                                                                                        "refs": [
                                                                                                                                            {
                                                                                                                                                "name": "jsonpathroot",
                                                                                                                                                "refs": []
                                                                                                                                            },
                                                                                                                                            {
                                                                                                                                                "name": "jsonpathkey",
                                                                                                                                                "refs": []
                                                                                                                                            }
                                                                                                                                        ]
                                                                                                                                    }
                                                                                                                                ]
                                                                                                                            },
                                                                                                                            {
                                                                                                                                "name": "DECIMAL",
                                                                                                                                "refs": []
                                                                                                                            }
                                                                                                                        ]
                                                                                                                    }
                                                                                                                ]
                                                                                                            }
                                                                                                        ]
                                                                                                    }
                                                                                                ]
                                                                                            },
                                                                                            {
                                                                                                "name": "literal:high_price",
                                                                                                "refs": []
                                                                                            },
                                                                                            {
                                                                                                "name": "high_p",
                                                                                                "table": "daily_stats",
                                                                                                "refs": [
                                                                                                    {
                                                                                                        "name": "high_p",
                                                                                                        "table": "daily_stats",
                                                                                                        "refs": [
                                                                                                            {
                                                                                                                "name": "max",
                                                                                                                "refs": [
                                                                                                                    {
                                                                                                                        "name": "cast",
                                                                                                                        "refs": [
                                                                                                                            {
                                                                                                                                "name": "jsonextractscalar",
                                                                                                                                "refs": [
                                                                                                                                    {
                                                                                                                                        "name": "p_entry",
                                                                                                                                        "table": "group_holding_day",
                                                                                                                                        "refs": []
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                        "name": "jsonpath",
                                                                                                                                        "refs": [
                                                                                                                                            {
                                                                                                                                                "name": "jsonpathroot",
                                                                                                                                                "refs": []
                                                                                                                                            },
                                                                                                                                            {
                                                                                                                                                "name": "jsonpathkey",
                                                                                                                                                "refs": []
                                                                                                                                            }
                                                                                                                                        ]
                                                                                                                                    }
                                                                                                                                ]
                                                                                                                            },
                                                                                                                            {
                                                                                                                                "name": "DECIMAL",
                                                                                                                                "refs": []
                                                                                                                            }
                                                                                                                        ]
                                                                                                                    }
                                                                                                                ]
                                                                                                            }
                                                                                                        ]
                                                                                                    }
                                                                                                ]
                                                                                            },
                                                                                            {
                                                                                                "name": "literal:open_price",
                                                                                                "refs": []
                                                                                            },
                                                                                            {
                                                                                                "name": "open_p",
                                                                                                "table": "daily_stats",
                                                                                                "refs": [
                                                                                                    {
                                                                                                        "name": "open_p",
                                                                                                        "table": "daily_stats",
                                                                                                        "refs": [
                                                                                                            {
                                                                                                                "name": "cast",
                                                                                                                "refs": [
                                                                                                                    {
                                                                                                                        "name": "bracket",
                                                                                                                        "refs": [
                                                                                                                            {
                                                                                                                                "name": "arrayagg",
                                                                                                                                "refs": [
                                                                                                                                    {
                                                                                                                                        "name": "order",
                                                                                                                                        "refs": [
                                                                                                                                            {
                                                                                                                                                "name": "jsonextractscalar",
                                                                                                                                                "refs": [
                                                                                                                                                    {
                                                                                                                                                        "name": "p_entry",
                                                                                                                                                        "table": "group_holding_day",
                                                                                                                                                        "refs": []
                                                                                                                                                    },
                                                                                                                                                    {
                                                                                                                                                        "name": "jsonpath",
                                                                                                                                                        "refs": [
                                                                                                                                                            {
                                                                                                                                                                "name": "jsonpathroot",
                                                                                                                                                                "refs": []
                                                                                                                                                            },
                                                                                                                                                            {
                                                                                                                                                                "name": "jsonpathkey",
                                                                                                                                                                "refs": []
                                                                                                                                                            }
                                                                                                                                                        ]
                                                                                                                                                    }
                                                                                                                                                ]
                                                                                                                                            },
                                                                                                                                            {
                                                                                                                                                "name": "ordered",
                                                                                                                                                "refs": [
                                                                                                                                                    {
                                                                                                                                                        "name": "jsonextractscalar",
                                                                                                                                                        "refs": [
                                                                                                                                                            {
                                                                                                                                                                "name": "p_entry",
                                                                                                                                                                "table": "group_holding_day",
                                                                                                                                                                "refs": []
                                                                                                                                                            },
                                                                                                                                                            {
                                                                                                                                                                "name": "jsonpath",
                                                                                                                                                                "refs": [
                                                                                                                                                                    {
                                                                                                                                                                        "name": "jsonpathroot",
                                                                                                                                                                        "refs": []
                                                                                                                                                                    },
                                                                                                                                                                    {
                                                                                                                                                                        "name": "jsonpathkey",
                                                                                                                                                                        "refs": []
                                                                                                                                                                    }
                                                                                                                                                                ]
                                                                                                                                                            }
                                                                                                                                                        ]
                                                                                                                                                    }
                                                                                                                                                ]
                                                                                                                                            }
                                                                                                                                        ]
                                                                                                                                    }
                                                                                                                                ]
                                                                                                                            },
                                                                                                                            {
                                                                                                                                "name": "literal:0",
                                                                                                                                "refs": []
                                                                                                                            }
                                                                                                                        ]
                                                                                                                    },
                                                                                                                    {
                                                                                                                        "name": "DECIMAL",
                                                                                                                        "refs": []
                                                                                                                    }
                                                                                                                ]
                                                                                                            }
                                                                                                        ]
                                                                                                    }
                                                                                                ]
                                                                                            },
                                                                                            {
                                                                                                "name": "literal:close_price",
                                                                                                "refs": []
                                                                                            },
                                                                                            {
                                                                                                "name": "close_p",
                                                                                                "table": "daily_stats",
                                                                                                "refs": [
                                                                                                    {
                                                                                                        "name": "close_p",
                                                                                                        "table": "daily_stats",
                                                                                                        "refs": [
                                                                                                            {
                                                                                                                "name": "cast",
                                                                                                                "refs": [
                                                                                                                    {
                                                                                                                        "name": "bracket",
                                                                                                                        "refs": [
                                                                                                                            {
                                                                                                                                "name": "arrayagg",
                                                                                                                                "refs": [
                                                                                                                                    {
                                                                                                                                        "name": "order",
                                                                                                                                        "refs": [
                                                                                                                                            {
                                                                                                                                                "name": "jsonextractscalar",
                                                                                                                                                "refs": [
                                                                                                                                                    {
                                                                                                                                                        "name": "p_entry",
                                                                                                                                                        "table": "group_holding_day",
                                                                                                                                                        "refs": []
                                                                                                                                                    },
                                                                                                                                                    {
                                                                                                                                                        "name": "jsonpath",
                                                                                                                                                        "refs": [
                                                                                                                                                            {
                                                                                                                                                                "name": "jsonpathroot",
                                                                                                                                                                "refs": []
                                                                                                                                                            },
                                                                                                                                                            {
                                                                                                                                                                "name": "jsonpathkey",
                                                                                                                                                                "refs": []
                                                                                                                                                            }
                                                                                                                                                        ]
                                                                                                                                                    }
                                                                                                                                                ]
                                                                                                                                            },
                                                                                                                                            {
                                                                                                                                                "name": "ordered",
                                                                                                                                                "refs": [
                                                                                                                                                    {
                                                                                                                                                        "name": "jsonextractscalar",
                                                                                                                                                        "refs": [
                                                                                                                                                            {
                                                                                                                                                                "name": "p_entry",
                                                                                                                                                                "table": "group_holding_day",
                                                                                                                                                                "refs": []
                                                                                                                                                            },
                                                                                                                                                            {
                                                                                                                                                                "name": "jsonpath",
                                                                                                                                                                "refs": [
                                                                                                                                                                    {
                                                                                                                                                                        "name": "jsonpathroot",
                                                                                                                                                                        "refs": []
                                                                                                                                                                    },
                                                                                                                                                                    {
                                                                                                                                                                        "name": "jsonpathkey",
                                                                                                                                                                        "refs": []
                                                                                                                                                                    }
                                                                                                                                                                ]
                                                                                                                                                            }
                                                                                                                                                        ]
                                                                                                                                                    }
                                                                                                                                                ]
                                                                                                                                            }
                                                                                                                                        ]
                                                                                                                                    }
                                                                                                                                ]
                                                                                                                            },
                                                                                                                            {
                                                                                                                                "name": "literal:0",
                                                                                                                                "refs": []
                                                                                                                            }
                                                                                                                        ]
                                                                                                                    },
                                                                                                                    {
                                                                                                                        "name": "DECIMAL",
                                                                                                                        "refs": []
                                                                                                                    }
                                                                                                                ]
                                                                                                            }
                                                                                                        ]
                                                                                                    }
                                                                                                ]
                                                                                            }
                                                                                        ]
                                                                                    },
                                                                                    {
                                                                                        "name": "ordered",
                                                                                        "refs": [
                                                                                            {
                                                                                                "name": "r_date",
                                                                                                "table": "daily_stats",
                                                                                                "refs": [
                                                                                                    {
                                                                                                        "name": "r_date",
                                                                                                        "table": "daily_stats",
                                                                                                        "refs": [
                                                                                                            {
                                                                                                                "name": "jsonextractscalar",
                                                                                                                "refs": [
                                                                                                                    {
                                                                                                                        "name": "day_data",
                                                                                                                        "table": "group_holding_day",
                                                                                                                        "refs": []
                                                                                                                    },
                                                                                                                    {
                                                                                                                        "name": "jsonpath",
                                                                                                                        "refs": [
                                                                                                                            {
                                                                                                                                "name": "jsonpathroot",
                                                                                                                                "refs": []
                                                                                                                            },
                                                                                                                            {
                                                                                                                                "name": "jsonpathkey",
                                                                                                                                "refs": []
                                                                                                                            }
                                                                                                                        ]
                                                                                                                    }
                                                                                                                ]
                                                                                                            }
                                                                                                        ]
                                                                                                    }
                                                                                                ]
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "JSONB",
                                                        "refs": []
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "command": {
                            "command": "sql-nav-link.openPath",
                            "title": "\"group_day_holding_with_bors\"",
                            "arguments": [
                                "e:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\group_day_holding_with_bors.sql"
                            ]
                        }
                    },
                    "refs": [],
                    "fields": []
                },
                {
                    "model": {
                        "collapsibleState": 1,
                        "label": "\"cool_reddit_seven_day_trending_two\"",
                        "name": "\"cool_reddit_seven_day_trending_two\"",
                        "file_name": "reddit_trending_with_prices.sql",
                        "file_path": "e:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\reddit_trending_with_prices.sql",
                        "table_names": [
                            "last_two_week_prices",
                            "reddit_seven_day_trending_two"
                        ],
                        "columns": [
                            {
                                "name": "count",
                                "table": "UNION",
                                "refs": [
                                    {
                                        "name": "count",
                                        "table": "union",
                                        "refs": [
                                            {
                                                "name": "count",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "count",
                                                        "table": "combined_trending",
                                                        "refs": [
                                                            {
                                                                "name": "count",
                                                                "table": "union",
                                                                "refs": [
                                                                    {
                                                                        "name": "count",
                                                                        "table": "reddit_seven_day_trending_two",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "name": "count",
                                                                "table": "union",
                                                                "refs": [
                                                                    {
                                                                        "name": "count",
                                                                        "table": "reddit_seven_day_trending_two",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "name": "count",
                                        "table": "union",
                                        "refs": [
                                            {
                                                "name": "count",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "count",
                                                        "table": "combined_trending",
                                                        "refs": [
                                                            {
                                                                "name": "count",
                                                                "table": "union",
                                                                "refs": [
                                                                    {
                                                                        "name": "count",
                                                                        "table": "reddit_seven_day_trending_two",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "name": "count",
                                                                "table": "union",
                                                                "refs": [
                                                                    {
                                                                        "name": "count",
                                                                        "table": "reddit_seven_day_trending_two",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "json_agg",
                                "table": "UNION",
                                "refs": [
                                    {
                                        "name": "json_agg",
                                        "table": "union",
                                        "refs": [
                                            {
                                                "name": "json_agg",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "json_agg",
                                                        "table": "combined_trending",
                                                        "refs": [
                                                            {
                                                                "name": "json_agg",
                                                                "table": "union",
                                                                "refs": [
                                                                    {
                                                                        "name": "json_agg",
                                                                        "table": "reddit_seven_day_trending_two",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "name": "json_agg",
                                                                "table": "union",
                                                                "refs": [
                                                                    {
                                                                        "name": "json_agg",
                                                                        "table": "reddit_seven_day_trending_two",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "name": "json_agg",
                                        "table": "union",
                                        "refs": [
                                            {
                                                "name": "json_agg",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "json_agg",
                                                        "table": "combined_trending",
                                                        "refs": [
                                                            {
                                                                "name": "json_agg",
                                                                "table": "union",
                                                                "refs": [
                                                                    {
                                                                        "name": "json_agg",
                                                                        "table": "reddit_seven_day_trending_two",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "name": "json_agg",
                                                                "table": "union",
                                                                "refs": [
                                                                    {
                                                                        "name": "json_agg",
                                                                        "table": "reddit_seven_day_trending_two",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "instid",
                                "table": "UNION",
                                "refs": [
                                    {
                                        "name": "instid",
                                        "table": "union",
                                        "refs": [
                                            {
                                                "name": "instid",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "instid",
                                                        "table": "combined_trending",
                                                        "refs": [
                                                            {
                                                                "name": "instid",
                                                                "table": "union",
                                                                "refs": [
                                                                    {
                                                                        "name": "instid",
                                                                        "table": "reddit_seven_day_trending_two",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "name": "instid",
                                                                "table": "union",
                                                                "refs": [
                                                                    {
                                                                        "name": "instid",
                                                                        "table": "reddit_seven_day_trending_two",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "name": "instid",
                                        "table": "union",
                                        "refs": [
                                            {
                                                "name": "instid",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "instid",
                                                        "table": "combined_trending",
                                                        "refs": [
                                                            {
                                                                "name": "instid",
                                                                "table": "union",
                                                                "refs": [
                                                                    {
                                                                        "name": "instid",
                                                                        "table": "reddit_seven_day_trending_two",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "name": "instid",
                                                                "table": "union",
                                                                "refs": [
                                                                    {
                                                                        "name": "instid",
                                                                        "table": "reddit_seven_day_trending_two",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "orderbookid",
                                "table": "UNION",
                                "refs": [
                                    {
                                        "name": "orderbookid",
                                        "table": "union",
                                        "refs": [
                                            {
                                                "name": "orderbookid",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "orderbookid",
                                                        "table": "combined_trending",
                                                        "refs": [
                                                            {
                                                                "name": "orderbookid",
                                                                "table": "union",
                                                                "refs": [
                                                                    {
                                                                        "name": "orderbookid",
                                                                        "table": "reddit_seven_day_trending_two",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "name": "orderbookid",
                                                                "table": "union",
                                                                "refs": [
                                                                    {
                                                                        "name": "orderbookid",
                                                                        "table": "reddit_seven_day_trending_two",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "name": "orderbookid",
                                        "table": "union",
                                        "refs": [
                                            {
                                                "name": "orderbookid",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "orderbookid",
                                                        "table": "combined_trending",
                                                        "refs": [
                                                            {
                                                                "name": "orderbookid",
                                                                "table": "union",
                                                                "refs": [
                                                                    {
                                                                        "name": "orderbookid",
                                                                        "table": "reddit_seven_day_trending_two",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "name": "orderbookid",
                                                                "table": "union",
                                                                "refs": [
                                                                    {
                                                                        "name": "orderbookid",
                                                                        "table": "reddit_seven_day_trending_two",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "tickersymbol",
                                "table": "UNION",
                                "refs": [
                                    {
                                        "name": "tickersymbol",
                                        "table": "union",
                                        "refs": [
                                            {
                                                "name": "tickersymbol",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "tickersymbol",
                                                        "table": "combined_trending",
                                                        "refs": [
                                                            {
                                                                "name": "tickersymbol",
                                                                "table": "union",
                                                                "refs": [
                                                                    {
                                                                        "name": "tickersymbol",
                                                                        "table": "reddit_seven_day_trending_two",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "name": "tickersymbol",
                                                                "table": "union",
                                                                "refs": [
                                                                    {
                                                                        "name": "tickersymbol",
                                                                        "table": "reddit_seven_day_trending_two",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "name": "tickersymbol",
                                        "table": "union",
                                        "refs": [
                                            {
                                                "name": "tickersymbol",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "tickersymbol",
                                                        "table": "combined_trending",
                                                        "refs": [
                                                            {
                                                                "name": "tickersymbol",
                                                                "table": "union",
                                                                "refs": [
                                                                    {
                                                                        "name": "tickersymbol",
                                                                        "table": "reddit_seven_day_trending_two",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "name": "tickersymbol",
                                                                "table": "union",
                                                                "refs": [
                                                                    {
                                                                        "name": "tickersymbol",
                                                                        "table": "reddit_seven_day_trending_two",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "name",
                                "table": "UNION",
                                "refs": [
                                    {
                                        "name": "name",
                                        "table": "union",
                                        "refs": [
                                            {
                                                "name": "name",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "name",
                                                        "table": "combined_trending",
                                                        "refs": [
                                                            {
                                                                "name": "name",
                                                                "table": "union",
                                                                "refs": [
                                                                    {
                                                                        "name": "name",
                                                                        "table": "reddit_seven_day_trending_two",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "name": "name",
                                                                "table": "union",
                                                                "refs": [
                                                                    {
                                                                        "name": "name",
                                                                        "table": "reddit_seven_day_trending_two",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "name": "name",
                                        "table": "union",
                                        "refs": [
                                            {
                                                "name": "name",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "name",
                                                        "table": "combined_trending",
                                                        "refs": [
                                                            {
                                                                "name": "name",
                                                                "table": "union",
                                                                "refs": [
                                                                    {
                                                                        "name": "name",
                                                                        "table": "reddit_seven_day_trending_two",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "name": "name",
                                                                "table": "union",
                                                                "refs": [
                                                                    {
                                                                        "name": "name",
                                                                        "table": "reddit_seven_day_trending_two",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "status",
                                "table": "UNION",
                                "refs": [
                                    {
                                        "name": "status",
                                        "table": "union",
                                        "refs": [
                                            {
                                                "name": "status",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "status",
                                                        "table": "combined_trending",
                                                        "refs": [
                                                            {
                                                                "name": "status",
                                                                "table": "union",
                                                                "refs": [
                                                                    {
                                                                        "name": "literal:active",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "name": "status",
                                                                "table": "union",
                                                                "refs": [
                                                                    {
                                                                        "name": "literal:archived",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "name": "status",
                                        "table": "union",
                                        "refs": [
                                            {
                                                "name": "status",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "status",
                                                        "table": "combined_trending",
                                                        "refs": [
                                                            {
                                                                "name": "status",
                                                                "table": "union",
                                                                "refs": [
                                                                    {
                                                                        "name": "literal:active",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "name": "status",
                                                                "table": "union",
                                                                "refs": [
                                                                    {
                                                                        "name": "literal:archived",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "price_data",
                                "table": "UNION",
                                "refs": [
                                    {
                                        "name": "price_data",
                                        "table": "union",
                                        "refs": [
                                            {
                                                "name": "price_data",
                                                "table": "rp",
                                                "refs": [
                                                    {
                                                        "name": "price_data",
                                                        "table": "rp",
                                                        "refs": [
                                                            {
                                                                "name": "price_data",
                                                                "table": "last_two_week_prices",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "name": "price_data",
                                        "table": "union",
                                        "refs": [
                                            {
                                                "name": "price_data",
                                                "table": "rp",
                                                "refs": [
                                                    {
                                                        "name": "price_data",
                                                        "table": "rp",
                                                        "refs": [
                                                            {
                                                                "name": "price_data",
                                                                "table": "last_two_week_prices",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "last_update_time",
                                "table": "UNION",
                                "refs": [
                                    {
                                        "name": "last_update_time",
                                        "table": "union",
                                        "refs": [
                                            {
                                                "name": "currenttimestamp",
                                                "refs": []
                                            }
                                        ]
                                    },
                                    {
                                        "name": "last_update_time",
                                        "table": "union",
                                        "refs": [
                                            {
                                                "name": "currenttimestamp",
                                                "refs": []
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "command": {
                            "command": "sql-nav-link.openPath",
                            "title": "\"cool_reddit_seven_day_trending_two\"",
                            "arguments": [
                                "e:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\reddit_trending_with_prices.sql"
                            ]
                        }
                    },
                    "refs": [],
                    "fields": [
                        "count",
                        "json_agg",
                        "instid",
                        "orderbookid",
                        "tickersymbol",
                        "name",
                        "status",
                        "price_data",
                        "last_update_time"
                    ]
                }
            ],
            "fields": [
                "trade_date",
                "ins_id",
                "high_price",
                "low_price",
                "open_price",
                "close_price",
                "volume"
            ]
        }
    ],
    "size_left": "3",
    "size_right": "2"
}

export const testData = {
    "centerModels": [
        {
            "model": {
                "collapsibleState": 1,
                "label": "\"cool_reddit_seven_day_trending\"",
                "name": "\"cool_reddit_seven_day_trending\"",
                "file_name": "reddit_trending_with_prices.sql",
                "file_path": "e:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\reddit_trending_with_prices.sql",
                "table_names": [
                    "reddit_seven_day_trending",
                    "last_two_week_prices"
                ],
                "columns": [
                    {
                        "name": "count",
                        "table": "UNION",
                        "refs": [
                            {
                                "name": "count",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "count",
                                        "table": "combined_trending",
                                        "refs": [
                                            {
                                                "name": "count",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "count",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "count",
                                                                "table": "reddit_seven_day_trending",
                                                                "refs": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "count",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "count",
                                                                "table": "reddit_seven_day_trending",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "count",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "count",
                                        "table": "combined_trending",
                                        "refs": [
                                            {
                                                "name": "count",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "count",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "count",
                                                                "table": "reddit_seven_day_trending",
                                                                "refs": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "count",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "count",
                                                                "table": "reddit_seven_day_trending",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "json_agg",
                        "table": "UNION",
                        "refs": [
                            {
                                "name": "json_agg",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "json_agg",
                                        "table": "combined_trending",
                                        "refs": [
                                            {
                                                "name": "json_agg",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "json_agg",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "json_agg",
                                                                "table": "reddit_seven_day_trending",
                                                                "refs": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "json_agg",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "json_agg",
                                                                "table": "reddit_seven_day_trending",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "json_agg",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "json_agg",
                                        "table": "combined_trending",
                                        "refs": [
                                            {
                                                "name": "json_agg",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "json_agg",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "json_agg",
                                                                "table": "reddit_seven_day_trending",
                                                                "refs": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "json_agg",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "json_agg",
                                                                "table": "reddit_seven_day_trending",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "instid",
                        "table": "UNION",
                        "refs": [
                            {
                                "name": "instid",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "instid",
                                        "table": "combined_trending",
                                        "refs": [
                                            {
                                                "name": "instid",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "instid",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "instid",
                                                                "table": "reddit_seven_day_trending",
                                                                "refs": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "instid",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "instid",
                                                                "table": "reddit_seven_day_trending",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "instid",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "instid",
                                        "table": "combined_trending",
                                        "refs": [
                                            {
                                                "name": "instid",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "instid",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "instid",
                                                                "table": "reddit_seven_day_trending",
                                                                "refs": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "instid",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "instid",
                                                                "table": "reddit_seven_day_trending",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "orderbookid",
                        "table": "UNION",
                        "refs": [
                            {
                                "name": "orderbookid",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "orderbookid",
                                        "table": "combined_trending",
                                        "refs": [
                                            {
                                                "name": "orderbookid",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "orderbookid",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "orderbookid",
                                                                "table": "reddit_seven_day_trending",
                                                                "refs": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "orderbookid",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "orderbookid",
                                                                "table": "reddit_seven_day_trending",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "orderbookid",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "orderbookid",
                                        "table": "combined_trending",
                                        "refs": [
                                            {
                                                "name": "orderbookid",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "orderbookid",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "orderbookid",
                                                                "table": "reddit_seven_day_trending",
                                                                "refs": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "orderbookid",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "orderbookid",
                                                                "table": "reddit_seven_day_trending",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "tickersymbol",
                        "table": "UNION",
                        "refs": [
                            {
                                "name": "tickersymbol",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "tickersymbol",
                                        "table": "combined_trending",
                                        "refs": [
                                            {
                                                "name": "tickersymbol",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "tickersymbol",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "tickersymbol",
                                                                "table": "reddit_seven_day_trending",
                                                                "refs": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "tickersymbol",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "tickersymbol",
                                                                "table": "reddit_seven_day_trending",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "tickersymbol",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "tickersymbol",
                                        "table": "combined_trending",
                                        "refs": [
                                            {
                                                "name": "tickersymbol",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "tickersymbol",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "tickersymbol",
                                                                "table": "reddit_seven_day_trending",
                                                                "refs": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "tickersymbol",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "tickersymbol",
                                                                "table": "reddit_seven_day_trending",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "name",
                        "table": "UNION",
                        "refs": [
                            {
                                "name": "name",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "name",
                                        "table": "combined_trending",
                                        "refs": [
                                            {
                                                "name": "name",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "name",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "name",
                                                                "table": "reddit_seven_day_trending",
                                                                "refs": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "name",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "name",
                                                                "table": "reddit_seven_day_trending",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "name",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "name",
                                        "table": "combined_trending",
                                        "refs": [
                                            {
                                                "name": "name",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "name",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "name",
                                                                "table": "reddit_seven_day_trending",
                                                                "refs": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "name",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "name",
                                                                "table": "reddit_seven_day_trending",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "status",
                        "table": "UNION",
                        "refs": [
                            {
                                "name": "status",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "status",
                                        "table": "combined_trending",
                                        "refs": [
                                            {
                                                "name": "status",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "status",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "literal:active",
                                                                "refs": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "status",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "literal:archived",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "status",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "status",
                                        "table": "combined_trending",
                                        "refs": [
                                            {
                                                "name": "status",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "status",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "literal:active",
                                                                "refs": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "status",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "literal:archived",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "price_data",
                        "table": "UNION",
                        "refs": [
                            {
                                "name": "price_data",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "price_data",
                                        "table": "rp",
                                        "refs": [
                                            {
                                                "name": "price_data",
                                                "table": "rp",
                                                "refs": [
                                                    {
                                                        "name": "price_data",
                                                        "table": "last_two_week_prices",
                                                        "refs": []
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "price_data",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "price_data",
                                        "table": "rp",
                                        "refs": [
                                            {
                                                "name": "price_data",
                                                "table": "rp",
                                                "refs": [
                                                    {
                                                        "name": "price_data",
                                                        "table": "last_two_week_prices",
                                                        "refs": []
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "last_update_time",
                        "table": "UNION",
                        "refs": [
                            {
                                "name": "last_update_time",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "currenttimestamp",
                                        "refs": []
                                    }
                                ]
                            },
                            {
                                "name": "last_update_time",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "currenttimestamp",
                                        "refs": []
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "command": {
                    "command": "sql-nav-link.openPath",
                    "title": "\"cool_reddit_seven_day_trending\"",
                    "arguments": [
                        "e:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\reddit_trending_with_prices.sql"
                    ]
                }
            },
            "refs": [
                {
                    "model": {
                        "collapsibleState": 1,
                        "label": "\"reddit_seven_day_trending\"",
                        "name": "\"reddit_seven_day_trending\"",
                        "file_name": "reddit_seven_day_trending.sql",
                        "file_path": "e:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\reddit_seven_day_trending.sql",
                        "table_names": [
                            "recent_reddit",
                            "public.postgres.bors_info"
                        ],
                        "columns": [
                            {
                                "name": "count",
                                "table": "\"reddit_seven_day_trending\"",
                                "refs": [
                                    {
                                        "name": "count",
                                        "table": "red_cou",
                                        "refs": [
                                            {
                                                "name": "count",
                                                "table": "red_cou",
                                                "refs": [
                                                    {
                                                        "name": "count",
                                                        "refs": [
                                                            {
                                                                "name": "split_ins_id",
                                                                "table": "recent_reddit",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "json_agg",
                                "table": "\"reddit_seven_day_trending\"",
                                "refs": [
                                    {
                                        "name": "json_agg",
                                        "table": "red_cou",
                                        "refs": [
                                            {
                                                "name": "json_agg",
                                                "table": "red_cou",
                                                "refs": [
                                                    {
                                                        "name": "jsonarrayagg",
                                                        "refs": [
                                                            {
                                                                "name": "JSONB_BUILD_OBJECT",
                                                                "refs": [
                                                                    {
                                                                        "name": "literal:date",
                                                                        "refs": []
                                                                    },
                                                                    {
                                                                        "name": "created_utc",
                                                                        "table": "recent_reddit",
                                                                        "refs": []
                                                                    },
                                                                    {
                                                                        "name": "literal:sub",
                                                                        "refs": []
                                                                    },
                                                                    {
                                                                        "name": "sub",
                                                                        "table": "recent_reddit",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "instid",
                                "table": "\"reddit_seven_day_trending\"",
                                "refs": [
                                    {
                                        "name": "instid",
                                        "table": "public.postgres.bors_info",
                                        "refs": []
                                    }
                                ]
                            },
                            {
                                "name": "orderbookid",
                                "table": "\"reddit_seven_day_trending\"",
                                "refs": [
                                    {
                                        "name": "orderbookid",
                                        "table": "public.postgres.bors_info",
                                        "refs": []
                                    }
                                ]
                            },
                            {
                                "name": "tickersymbol",
                                "table": "\"reddit_seven_day_trending\"",
                                "refs": [
                                    {
                                        "name": "tickersymbol",
                                        "table": "public.postgres.bors_info",
                                        "refs": []
                                    }
                                ]
                            },
                            {
                                "name": "name",
                                "table": "\"reddit_seven_day_trending\"",
                                "refs": [
                                    {
                                        "name": "name",
                                        "table": "public.postgres.bors_info",
                                        "refs": []
                                    }
                                ]
                            }
                        ],
                        "command": {
                            "command": "sql-nav-link.openPath",
                            "title": "\"reddit_seven_day_trending\"",
                            "arguments": [
                                "e:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\reddit_seven_day_trending.sql"
                            ]
                        }
                    },
                    "refs": [
                        {
                            "model": {
                                "collapsibleState": 1,
                                "label": "\"recent_reddit\"",
                                "name": "\"recent_reddit\"",
                                "file_name": "recent_reddit.sql",
                                "file_path": "e:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_reddit.sql",
                                "table_names": [
                                    "public.postgres.reddit"
                                ],
                                "columns": [
                                    {
                                        "name": "created_utc",
                                        "table": "\"recent_reddit\"",
                                        "refs": [
                                            {
                                                "name": "created_utc",
                                                "table": "public.postgres.reddit",
                                                "refs": []
                                            }
                                        ]
                                    },
                                    {
                                        "name": "sub",
                                        "table": "\"recent_reddit\"",
                                        "refs": [
                                            {
                                                "name": "sub",
                                                "table": "public.postgres.reddit",
                                                "refs": []
                                            }
                                        ]
                                    },
                                    {
                                        "name": "split_ins_id",
                                        "table": "\"recent_reddit\"",
                                        "refs": [
                                            {
                                                "name": "JSONB_ARRAY_ELEMENTS_TEXT",
                                                "refs": [
                                                    {
                                                        "name": "cast",
                                                        "refs": [
                                                            {
                                                                "name": "ins_id",
                                                                "table": "public.postgres.reddit",
                                                                "refs": []
                                                            },
                                                            {
                                                                "name": "JSONB",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                "command": {
                                    "command": "sql-nav-link.openPath",
                                    "title": "\"recent_reddit\"",
                                    "arguments": [
                                        "e:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_reddit.sql"
                                    ]
                                }
                            },
                            "refs": [
                                {
                                    "model": {
                                        "name": "public.postgres.reddit",
                                        "file_name": "",
                                        "file_path": "",
                                        "table_names": [],
                                        "columns": [
                                            {
                                                "name": "created_utc",
                                                "table": "public.postgres.reddit",
                                                "refs": []
                                            },
                                            {
                                                "name": "sub",
                                                "table": "public.postgres.reddit",
                                                "refs": []
                                            },
                                            {
                                                "name": "ins_id",
                                                "table": "public.postgres.reddit",
                                                "refs": []
                                            }
                                        ]
                                    },
                                    "refs": [],
                                    "fields": [
                                        "created_utc",
                                        "sub",
                                        "ins_id"
                                    ]
                                }
                            ],
                            "fields": [
                                "created_utc",
                                "sub",
                                "split_ins_id"
                            ]
                        },
                        {
                            "model": {
                                "name": "public.postgres.bors_info",
                                "file_name": "",
                                "file_path": "",
                                "table_names": [],
                                "columns": [
                                    {
                                        "name": "instid",
                                        "table": "public.postgres.bors_info",
                                        "refs": []
                                    },
                                    {
                                        "name": "orderbookid",
                                        "table": "public.postgres.bors_info",
                                        "refs": []
                                    },
                                    {
                                        "name": "tickersymbol",
                                        "table": "public.postgres.bors_info",
                                        "refs": []
                                    },
                                    {
                                        "name": "name",
                                        "table": "public.postgres.bors_info",
                                        "refs": []
                                    }
                                ]
                            },
                            "refs": [],
                            "fields": [
                                "instid",
                                "orderbookid",
                                "tickersymbol",
                                "name"
                            ]
                        }
                    ],
                    "fields": [
                        "count",
                        "json_agg",
                        "instid",
                        "orderbookid",
                        "tickersymbol",
                        "name"
                    ]
                },
                {
                    "model": {
                        "collapsibleState": 1,
                        "label": "\"last_two_week_prices\"",
                        "name": "\"last_two_week_prices\"",
                        "file_name": "last_two_week_prices.sql",
                        "file_path": "e:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\last_two_week_prices.sql",
                        "table_names": [
                            "recent_prices"
                        ],
                        "columns": [
                            {
                                "name": "ins_id",
                                "table": "\"last_two_week_prices\"",
                                "refs": [
                                    {
                                        "name": "ins_id",
                                        "table": "recent_prices",
                                        "refs": []
                                    }
                                ]
                            },
                            {
                                "name": "price_data",
                                "table": "\"last_two_week_prices\"",
                                "refs": [
                                    {
                                        "name": "arrayagg",
                                        "refs": [
                                            {
                                                "name": "JSONB_BUILD_OBJECT",
                                                "refs": [
                                                    {
                                                        "name": "literal:date",
                                                        "refs": []
                                                    },
                                                    {
                                                        "name": "trade_date",
                                                        "table": "recent_prices",
                                                        "refs": []
                                                    },
                                                    {
                                                        "name": "literal:high_price",
                                                        "refs": []
                                                    },
                                                    {
                                                        "name": "high_price",
                                                        "table": "recent_prices",
                                                        "refs": []
                                                    },
                                                    {
                                                        "name": "literal:low_price",
                                                        "refs": []
                                                    },
                                                    {
                                                        "name": "low_price",
                                                        "table": "recent_prices",
                                                        "refs": []
                                                    },
                                                    {
                                                        "name": "literal:close_price",
                                                        "refs": []
                                                    },
                                                    {
                                                        "name": "close_price",
                                                        "table": "recent_prices",
                                                        "refs": []
                                                    },
                                                    {
                                                        "name": "literal:open_price",
                                                        "refs": []
                                                    },
                                                    {
                                                        "name": "open_price",
                                                        "table": "recent_prices",
                                                        "refs": []
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "command": {
                            "command": "sql-nav-link.openPath",
                            "title": "\"last_two_week_prices\"",
                            "arguments": [
                                "e:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\last_two_week_prices.sql"
                            ]
                        }
                    },
                    "refs": [
                        {
                            "model": {
                                "collapsibleState": 1,
                                "label": "\"recent_prices\"",
                                "name": "\"recent_prices\"",
                                "file_name": "recent_prices.sql",
                                "file_path": "e:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_prices.sql",
                                "table_names": [
                                    "public.postgres.bors_prices"
                                ],
                                "columns": [
                                    {
                                        "name": "trade_date",
                                        "table": "\"recent_prices\"",
                                        "refs": [
                                            {
                                                "name": "trade_date",
                                                "table": "public.postgres.bors_prices",
                                                "refs": []
                                            }
                                        ]
                                    },
                                    {
                                        "name": "ins_id",
                                        "table": "\"recent_prices\"",
                                        "refs": [
                                            {
                                                "name": "ins_id",
                                                "table": "public.postgres.bors_prices",
                                                "refs": []
                                            }
                                        ]
                                    },
                                    {
                                        "name": "high_price",
                                        "table": "\"recent_prices\"",
                                        "refs": [
                                            {
                                                "name": "high_price",
                                                "table": "public.postgres.bors_prices",
                                                "refs": []
                                            }
                                        ]
                                    },
                                    {
                                        "name": "low_price",
                                        "table": "\"recent_prices\"",
                                        "refs": [
                                            {
                                                "name": "low_price",
                                                "table": "public.postgres.bors_prices",
                                                "refs": []
                                            }
                                        ]
                                    },
                                    {
                                        "name": "open_price",
                                        "table": "\"recent_prices\"",
                                        "refs": [
                                            {
                                                "name": "open_price",
                                                "table": "public.postgres.bors_prices",
                                                "refs": []
                                            }
                                        ]
                                    },
                                    {
                                        "name": "close_price",
                                        "table": "\"recent_prices\"",
                                        "refs": [
                                            {
                                                "name": "close_price",
                                                "table": "public.postgres.bors_prices",
                                                "refs": []
                                            }
                                        ]
                                    },
                                    {
                                        "name": "volume",
                                        "table": "\"recent_prices\"",
                                        "refs": [
                                            {
                                                "name": "volume",
                                                "table": "public.postgres.bors_prices",
                                                "refs": []
                                            }
                                        ]
                                    }
                                ],
                                "command": {
                                    "command": "sql-nav-link.openPath",
                                    "title": "\"recent_prices\"",
                                    "arguments": [
                                        "e:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_prices.sql"
                                    ]
                                }
                            },
                            "refs": [
                                {
                                    "model": {
                                        "name": "public.postgres.bors_prices",
                                        "file_name": "",
                                        "file_path": "",
                                        "table_names": [],
                                        "columns": [
                                            {
                                                "name": "trade_date",
                                                "table": "public.postgres.bors_prices",
                                                "refs": []
                                            },
                                            {
                                                "name": "ins_id",
                                                "table": "public.postgres.bors_prices",
                                                "refs": []
                                            },
                                            {
                                                "name": "high_price",
                                                "table": "public.postgres.bors_prices",
                                                "refs": []
                                            },
                                            {
                                                "name": "low_price",
                                                "table": "public.postgres.bors_prices",
                                                "refs": []
                                            },
                                            {
                                                "name": "open_price",
                                                "table": "public.postgres.bors_prices",
                                                "refs": []
                                            },
                                            {
                                                "name": "close_price",
                                                "table": "public.postgres.bors_prices",
                                                "refs": []
                                            },
                                            {
                                                "name": "volume",
                                                "table": "public.postgres.bors_prices",
                                                "refs": []
                                            }
                                        ]
                                    },
                                    "refs": [],
                                    "fields": [
                                        "trade_date",
                                        "ins_id",
                                        "high_price",
                                        "low_price",
                                        "open_price",
                                        "close_price",
                                        "volume"
                                    ]
                                }
                            ],
                            "fields": [
                                "trade_date",
                                "ins_id",
                                "high_price",
                                "low_price",
                                "open_price",
                                "close_price",
                                "volume"
                            ]
                        }
                    ],
                    "fields": [
                        "ins_id",
                        "price_data"
                    ]
                }
            ],
            "rightRefs": []
        },
        {
            "model": {
                "collapsibleState": 1,
                "label": "\"cool_reddit_seven_day_trending_two\"",
                "name": "\"cool_reddit_seven_day_trending_two\"",
                "file_name": "reddit_trending_with_prices.sql",
                "file_path": "e:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\reddit_trending_with_prices.sql",
                "table_names": [
                    "reddit_seven_day_trending_two",
                    "last_two_week_prices"
                ],
                "columns": [
                    {
                        "name": "count",
                        "table": "UNION",
                        "refs": [
                            {
                                "name": "count",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "count",
                                        "table": "combined_trending",
                                        "refs": [
                                            {
                                                "name": "count",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "count",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "count",
                                                                "table": "reddit_seven_day_trending_two",
                                                                "refs": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "count",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "count",
                                                                "table": "reddit_seven_day_trending_two",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "count",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "count",
                                        "table": "combined_trending",
                                        "refs": [
                                            {
                                                "name": "count",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "count",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "count",
                                                                "table": "reddit_seven_day_trending_two",
                                                                "refs": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "count",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "count",
                                                                "table": "reddit_seven_day_trending_two",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "json_agg",
                        "table": "UNION",
                        "refs": [
                            {
                                "name": "json_agg",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "json_agg",
                                        "table": "combined_trending",
                                        "refs": [
                                            {
                                                "name": "json_agg",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "json_agg",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "json_agg",
                                                                "table": "reddit_seven_day_trending_two",
                                                                "refs": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "json_agg",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "json_agg",
                                                                "table": "reddit_seven_day_trending_two",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "json_agg",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "json_agg",
                                        "table": "combined_trending",
                                        "refs": [
                                            {
                                                "name": "json_agg",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "json_agg",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "json_agg",
                                                                "table": "reddit_seven_day_trending_two",
                                                                "refs": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "json_agg",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "json_agg",
                                                                "table": "reddit_seven_day_trending_two",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "instid",
                        "table": "UNION",
                        "refs": [
                            {
                                "name": "instid",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "instid",
                                        "table": "combined_trending",
                                        "refs": [
                                            {
                                                "name": "instid",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "instid",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "instid",
                                                                "table": "reddit_seven_day_trending_two",
                                                                "refs": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "instid",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "instid",
                                                                "table": "reddit_seven_day_trending_two",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "instid",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "instid",
                                        "table": "combined_trending",
                                        "refs": [
                                            {
                                                "name": "instid",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "instid",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "instid",
                                                                "table": "reddit_seven_day_trending_two",
                                                                "refs": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "instid",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "instid",
                                                                "table": "reddit_seven_day_trending_two",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "orderbookid",
                        "table": "UNION",
                        "refs": [
                            {
                                "name": "orderbookid",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "orderbookid",
                                        "table": "combined_trending",
                                        "refs": [
                                            {
                                                "name": "orderbookid",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "orderbookid",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "orderbookid",
                                                                "table": "reddit_seven_day_trending_two",
                                                                "refs": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "orderbookid",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "orderbookid",
                                                                "table": "reddit_seven_day_trending_two",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "orderbookid",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "orderbookid",
                                        "table": "combined_trending",
                                        "refs": [
                                            {
                                                "name": "orderbookid",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "orderbookid",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "orderbookid",
                                                                "table": "reddit_seven_day_trending_two",
                                                                "refs": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "orderbookid",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "orderbookid",
                                                                "table": "reddit_seven_day_trending_two",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "tickersymbol",
                        "table": "UNION",
                        "refs": [
                            {
                                "name": "tickersymbol",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "tickersymbol",
                                        "table": "combined_trending",
                                        "refs": [
                                            {
                                                "name": "tickersymbol",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "tickersymbol",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "tickersymbol",
                                                                "table": "reddit_seven_day_trending_two",
                                                                "refs": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "tickersymbol",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "tickersymbol",
                                                                "table": "reddit_seven_day_trending_two",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "tickersymbol",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "tickersymbol",
                                        "table": "combined_trending",
                                        "refs": [
                                            {
                                                "name": "tickersymbol",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "tickersymbol",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "tickersymbol",
                                                                "table": "reddit_seven_day_trending_two",
                                                                "refs": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "tickersymbol",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "tickersymbol",
                                                                "table": "reddit_seven_day_trending_two",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "name",
                        "table": "UNION",
                        "refs": [
                            {
                                "name": "name",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "name",
                                        "table": "combined_trending",
                                        "refs": [
                                            {
                                                "name": "name",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "name",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "name",
                                                                "table": "reddit_seven_day_trending_two",
                                                                "refs": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "name",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "name",
                                                                "table": "reddit_seven_day_trending_two",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "name",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "name",
                                        "table": "combined_trending",
                                        "refs": [
                                            {
                                                "name": "name",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "name",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "name",
                                                                "table": "reddit_seven_day_trending_two",
                                                                "refs": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "name",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "name",
                                                                "table": "reddit_seven_day_trending_two",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "status",
                        "table": "UNION",
                        "refs": [
                            {
                                "name": "status",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "status",
                                        "table": "combined_trending",
                                        "refs": [
                                            {
                                                "name": "status",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "status",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "literal:active",
                                                                "refs": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "status",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "literal:archived",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "status",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "status",
                                        "table": "combined_trending",
                                        "refs": [
                                            {
                                                "name": "status",
                                                "table": "combined_trending",
                                                "refs": [
                                                    {
                                                        "name": "status",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "literal:active",
                                                                "refs": []
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "name": "status",
                                                        "table": "union",
                                                        "refs": [
                                                            {
                                                                "name": "literal:archived",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "price_data",
                        "table": "UNION",
                        "refs": [
                            {
                                "name": "price_data",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "price_data",
                                        "table": "rp",
                                        "refs": [
                                            {
                                                "name": "price_data",
                                                "table": "rp",
                                                "refs": [
                                                    {
                                                        "name": "price_data",
                                                        "table": "last_two_week_prices",
                                                        "refs": []
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "price_data",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "price_data",
                                        "table": "rp",
                                        "refs": [
                                            {
                                                "name": "price_data",
                                                "table": "rp",
                                                "refs": [
                                                    {
                                                        "name": "price_data",
                                                        "table": "last_two_week_prices",
                                                        "refs": []
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "last_update_time",
                        "table": "UNION",
                        "refs": [
                            {
                                "name": "last_update_time",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "currenttimestamp",
                                        "refs": []
                                    }
                                ]
                            },
                            {
                                "name": "last_update_time",
                                "table": "union",
                                "refs": [
                                    {
                                        "name": "currenttimestamp",
                                        "refs": []
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "command": {
                    "command": "sql-nav-link.openPath",
                    "title": "\"cool_reddit_seven_day_trending_two\"",
                    "arguments": [
                        "e:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\reddit_trending_with_prices.sql"
                    ]
                }
            },
            "refs": [
                {
                    "model": {
                        "collapsibleState": 1,
                        "label": "\"reddit_seven_day_trending_two\"",
                        "name": "\"reddit_seven_day_trending_two\"",
                        "file_name": "reddit_seven_day_trending_two.sql",
                        "file_path": "e:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\reddit_seven_day_trending_two.sql",
                        "table_names": [
                            "recent_reddit",
                            "public.postgres.bors_info"
                        ],
                        "columns": [
                            {
                                "name": "count",
                                "table": "\"reddit_seven_day_trending_two\"",
                                "refs": [
                                    {
                                        "name": "count",
                                        "table": "red_cou",
                                        "refs": [
                                            {
                                                "name": "count",
                                                "table": "red_cou",
                                                "refs": [
                                                    {
                                                        "name": "count",
                                                        "refs": [
                                                            {
                                                                "name": "split_ins_id",
                                                                "table": "recent_reddit",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "json_agg",
                                "table": "\"reddit_seven_day_trending_two\"",
                                "refs": [
                                    {
                                        "name": "json_agg",
                                        "table": "red_cou",
                                        "refs": [
                                            {
                                                "name": "json_agg",
                                                "table": "red_cou",
                                                "refs": [
                                                    {
                                                        "name": "jsonarrayagg",
                                                        "refs": [
                                                            {
                                                                "name": "JSONB_BUILD_OBJECT",
                                                                "refs": [
                                                                    {
                                                                        "name": "literal:date",
                                                                        "refs": []
                                                                    },
                                                                    {
                                                                        "name": "created_utc",
                                                                        "table": "recent_reddit",
                                                                        "refs": []
                                                                    },
                                                                    {
                                                                        "name": "literal:sub",
                                                                        "refs": []
                                                                    },
                                                                    {
                                                                        "name": "sub",
                                                                        "table": "recent_reddit",
                                                                        "refs": []
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "instid",
                                "table": "\"reddit_seven_day_trending_two\"",
                                "refs": [
                                    {
                                        "name": "instid",
                                        "table": "public.postgres.bors_info",
                                        "refs": []
                                    }
                                ]
                            },
                            {
                                "name": "orderbookid",
                                "table": "\"reddit_seven_day_trending_two\"",
                                "refs": [
                                    {
                                        "name": "orderbookid",
                                        "table": "public.postgres.bors_info",
                                        "refs": []
                                    }
                                ]
                            },
                            {
                                "name": "tickersymbol",
                                "table": "\"reddit_seven_day_trending_two\"",
                                "refs": [
                                    {
                                        "name": "tickersymbol",
                                        "table": "public.postgres.bors_info",
                                        "refs": []
                                    }
                                ]
                            },
                            {
                                "name": "name",
                                "table": "\"reddit_seven_day_trending_two\"",
                                "refs": [
                                    {
                                        "name": "name",
                                        "table": "public.postgres.bors_info",
                                        "refs": []
                                    }
                                ]
                            }
                        ],
                        "command": {
                            "command": "sql-nav-link.openPath",
                            "title": "\"reddit_seven_day_trending_two\"",
                            "arguments": [
                                "e:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\reddit_seven_day_trending_two.sql"
                            ]
                        }
                    },
                    "refs": [
                        {
                            "model": {
                                "collapsibleState": 1,
                                "label": "\"recent_reddit\"",
                                "name": "\"recent_reddit\"",
                                "file_name": "recent_reddit.sql",
                                "file_path": "e:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_reddit.sql",
                                "table_names": [
                                    "public.postgres.reddit"
                                ],
                                "columns": [
                                    {
                                        "name": "created_utc",
                                        "table": "\"recent_reddit\"",
                                        "refs": [
                                            {
                                                "name": "created_utc",
                                                "table": "public.postgres.reddit",
                                                "refs": []
                                            }
                                        ]
                                    },
                                    {
                                        "name": "sub",
                                        "table": "\"recent_reddit\"",
                                        "refs": [
                                            {
                                                "name": "sub",
                                                "table": "public.postgres.reddit",
                                                "refs": []
                                            }
                                        ]
                                    },
                                    {
                                        "name": "split_ins_id",
                                        "table": "\"recent_reddit\"",
                                        "refs": [
                                            {
                                                "name": "JSONB_ARRAY_ELEMENTS_TEXT",
                                                "refs": [
                                                    {
                                                        "name": "cast",
                                                        "refs": [
                                                            {
                                                                "name": "ins_id",
                                                                "table": "public.postgres.reddit",
                                                                "refs": []
                                                            },
                                                            {
                                                                "name": "JSONB",
                                                                "refs": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                "command": {
                                    "command": "sql-nav-link.openPath",
                                    "title": "\"recent_reddit\"",
                                    "arguments": [
                                        "e:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_reddit.sql"
                                    ]
                                }
                            },
                            "refs": [
                                {
                                    "model": {
                                        "name": "public.postgres.reddit",
                                        "file_name": "",
                                        "file_path": "",
                                        "table_names": [],
                                        "columns": [
                                            {
                                                "name": "created_utc",
                                                "table": "public.postgres.reddit",
                                                "refs": []
                                            },
                                            {
                                                "name": "sub",
                                                "table": "public.postgres.reddit",
                                                "refs": []
                                            },
                                            {
                                                "name": "ins_id",
                                                "table": "public.postgres.reddit",
                                                "refs": []
                                            }
                                        ]
                                    },
                                    "refs": [],
                                    "fields": [
                                        "created_utc",
                                        "sub",
                                        "ins_id"
                                    ]
                                }
                            ],
                            "fields": [
                                "created_utc",
                                "sub",
                                "split_ins_id"
                            ]
                        },
                        {
                            "model": {
                                "name": "public.postgres.bors_info",
                                "file_name": "",
                                "file_path": "",
                                "table_names": [],
                                "columns": [
                                    {
                                        "name": "instid",
                                        "table": "public.postgres.bors_info",
                                        "refs": []
                                    },
                                    {
                                        "name": "orderbookid",
                                        "table": "public.postgres.bors_info",
                                        "refs": []
                                    },
                                    {
                                        "name": "tickersymbol",
                                        "table": "public.postgres.bors_info",
                                        "refs": []
                                    },
                                    {
                                        "name": "name",
                                        "table": "public.postgres.bors_info",
                                        "refs": []
                                    }
                                ]
                            },
                            "refs": [],
                            "fields": [
                                "instid",
                                "orderbookid",
                                "tickersymbol",
                                "name"
                            ]
                        }
                    ],
                    "fields": [
                        "count",
                        "json_agg",
                        "instid",
                        "orderbookid",
                        "tickersymbol",
                        "name"
                    ]
                },
                {
                    "model": {
                        "collapsibleState": 1,
                        "label": "\"last_two_week_prices\"",
                        "name": "\"last_two_week_prices\"",
                        "file_name": "last_two_week_prices.sql",
                        "file_path": "e:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\last_two_week_prices.sql",
                        "table_names": [
                            "recent_prices"
                        ],
                        "columns": [
                            {
                                "name": "ins_id",
                                "table": "\"last_two_week_prices\"",
                                "refs": [
                                    {
                                        "name": "ins_id",
                                        "table": "recent_prices",
                                        "refs": []
                                    }
                                ]
                            },
                            {
                                "name": "price_data",
                                "table": "\"last_two_week_prices\"",
                                "refs": [
                                    {
                                        "name": "arrayagg",
                                        "refs": [
                                            {
                                                "name": "JSONB_BUILD_OBJECT",
                                                "refs": [
                                                    {
                                                        "name": "literal:date",
                                                        "refs": []
                                                    },
                                                    {
                                                        "name": "trade_date",
                                                        "table": "recent_prices",
                                                        "refs": []
                                                    },
                                                    {
                                                        "name": "literal:high_price",
                                                        "refs": []
                                                    },
                                                    {
                                                        "name": "high_price",
                                                        "table": "recent_prices",
                                                        "refs": []
                                                    },
                                                    {
                                                        "name": "literal:low_price",
                                                        "refs": []
                                                    },
                                                    {
                                                        "name": "low_price",
                                                        "table": "recent_prices",
                                                        "refs": []
                                                    },
                                                    {
                                                        "name": "literal:close_price",
                                                        "refs": []
                                                    },
                                                    {
                                                        "name": "close_price",
                                                        "table": "recent_prices",
                                                        "refs": []
                                                    },
                                                    {
                                                        "name": "literal:open_price",
                                                        "refs": []
                                                    },
                                                    {
                                                        "name": "open_price",
                                                        "table": "recent_prices",
                                                        "refs": []
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "command": {
                            "command": "sql-nav-link.openPath",
                            "title": "\"last_two_week_prices\"",
                            "arguments": [
                                "e:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\last_two_week_prices.sql"
                            ]
                        }
                    },
                    "refs": [
                        {
                            "model": {
                                "collapsibleState": 1,
                                "label": "\"recent_prices\"",
                                "name": "\"recent_prices\"",
                                "file_name": "recent_prices.sql",
                                "file_path": "e:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_prices.sql",
                                "table_names": [
                                    "public.postgres.bors_prices"
                                ],
                                "columns": [
                                    {
                                        "name": "trade_date",
                                        "table": "\"recent_prices\"",
                                        "refs": [
                                            {
                                                "name": "trade_date",
                                                "table": "public.postgres.bors_prices",
                                                "refs": []
                                            }
                                        ]
                                    },
                                    {
                                        "name": "ins_id",
                                        "table": "\"recent_prices\"",
                                        "refs": [
                                            {
                                                "name": "ins_id",
                                                "table": "public.postgres.bors_prices",
                                                "refs": []
                                            }
                                        ]
                                    },
                                    {
                                        "name": "high_price",
                                        "table": "\"recent_prices\"",
                                        "refs": [
                                            {
                                                "name": "high_price",
                                                "table": "public.postgres.bors_prices",
                                                "refs": []
                                            }
                                        ]
                                    },
                                    {
                                        "name": "low_price",
                                        "table": "\"recent_prices\"",
                                        "refs": [
                                            {
                                                "name": "low_price",
                                                "table": "public.postgres.bors_prices",
                                                "refs": []
                                            }
                                        ]
                                    },
                                    {
                                        "name": "open_price",
                                        "table": "\"recent_prices\"",
                                        "refs": [
                                            {
                                                "name": "open_price",
                                                "table": "public.postgres.bors_prices",
                                                "refs": []
                                            }
                                        ]
                                    },
                                    {
                                        "name": "close_price",
                                        "table": "\"recent_prices\"",
                                        "refs": [
                                            {
                                                "name": "close_price",
                                                "table": "public.postgres.bors_prices",
                                                "refs": []
                                            }
                                        ]
                                    },
                                    {
                                        "name": "volume",
                                        "table": "\"recent_prices\"",
                                        "refs": [
                                            {
                                                "name": "volume",
                                                "table": "public.postgres.bors_prices",
                                                "refs": []
                                            }
                                        ]
                                    }
                                ],
                                "command": {
                                    "command": "sql-nav-link.openPath",
                                    "title": "\"recent_prices\"",
                                    "arguments": [
                                        "e:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_prices.sql"
                                    ]
                                }
                            },
                            "refs": [
                                {
                                    "model": {
                                        "name": "public.postgres.bors_prices",
                                        "file_name": "",
                                        "file_path": "",
                                        "table_names": [],
                                        "columns": [
                                            {
                                                "name": "trade_date",
                                                "table": "public.postgres.bors_prices",
                                                "refs": []
                                            },
                                            {
                                                "name": "ins_id",
                                                "table": "public.postgres.bors_prices",
                                                "refs": []
                                            },
                                            {
                                                "name": "high_price",
                                                "table": "public.postgres.bors_prices",
                                                "refs": []
                                            },
                                            {
                                                "name": "low_price",
                                                "table": "public.postgres.bors_prices",
                                                "refs": []
                                            },
                                            {
                                                "name": "open_price",
                                                "table": "public.postgres.bors_prices",
                                                "refs": []
                                            },
                                            {
                                                "name": "close_price",
                                                "table": "public.postgres.bors_prices",
                                                "refs": []
                                            },
                                            {
                                                "name": "volume",
                                                "table": "public.postgres.bors_prices",
                                                "refs": []
                                            }
                                        ]
                                    },
                                    "refs": [],
                                    "fields": [
                                        "trade_date",
                                        "ins_id",
                                        "high_price",
                                        "low_price",
                                        "open_price",
                                        "close_price",
                                        "volume"
                                    ]
                                }
                            ],
                            "fields": [
                                "trade_date",
                                "ins_id",
                                "high_price",
                                "low_price",
                                "open_price",
                                "close_price",
                                "volume"
                            ]
                        }
                    ],
                    "fields": [
                        "ins_id",
                        "price_data"
                    ]
                }
            ],
            "rightRefs": []
        }
    ],
    "size_left": "3",
    "size_right": "2"
}


export const testData2 = {
    "centerModel": {
        "model": {
            "collapsibleState": 1,
            "label": "reddit_trending_with_prices",
            "name": "reddit_trending_with_prices",
            "file_name": "reddit_trending_with_prices.sql",
            "file_path": "E:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\reddit_trending_with_prices.sql",
            "table_names": [
                "last_two_week_prices",
                "reddit_seven_day_trending_two",
                "reddit_seven_day_trending"
            ],
            "columns": [
                {
                    "name": "count",
                    "table": "reddit_trending_with_prices",
                    "refs": [
                        {
                            "name": "COUNT",
                            "table": "reddit_seven_day_trending",
                            "refs": []
                        },
                        {
                            "name": "COUNT",
                            "table": "reddit_seven_day_trending_two",
                            "refs": []
                        }
                    ]
                },
                {
                    "name": "JSON_AGG",
                    "table": "reddit_trending_with_prices",
                    "refs": [
                        {
                            "name": "JSON_AGG",
                            "table": "reddit_seven_day_trending",
                            "refs": []
                        },
                        {
                            "name": "JSON_AGG",
                            "table": "reddit_seven_day_trending_two",
                            "refs": []
                        }
                    ]
                },
                {
                    "name": "instid",
                    "table": "reddit_trending_with_prices",
                    "refs": [
                        {
                            "name": "instid",
                            "table": "reddit_seven_day_trending",
                            "refs": []
                        },
                        {
                            "name": "instid",
                            "table": "reddit_seven_day_trending_two",
                            "refs": []
                        }
                    ]
                },
                {
                    "name": "orderbookid",
                    "table": "reddit_trending_with_prices",
                    "refs": [
                        {
                            "name": "orderbookid",
                            "table": "reddit_seven_day_trending_two",
                            "refs": []
                        },
                        {
                            "name": "orderbookid",
                            "table": "reddit_seven_day_trending",
                            "refs": []
                        }
                    ]
                },
                {
                    "name": "tickersymbol",
                    "table": "reddit_trending_with_prices",
                    "refs": [
                        {
                            "name": "tickersymbol",
                            "table": "reddit_seven_day_trending_two",
                            "refs": []
                        },
                        {
                            "name": "tickersymbol",
                            "table": "reddit_seven_day_trending",
                            "refs": []
                        }
                    ]
                },
                {
                    "name": "name",
                    "table": "reddit_trending_with_prices",
                    "refs": [
                        {
                            "name": "name",
                            "table": "reddit_seven_day_trending",
                            "refs": []
                        },
                        {
                            "name": "name",
                            "table": "reddit_seven_day_trending_two",
                            "refs": []
                        }
                    ]
                },
                {
                    "name": "status",
                    "table": "reddit_trending_with_prices",
                    "refs": [
                        {
                            "name": "status",
                            "table": "",
                            "refs": []
                        }
                    ]
                },
                {
                    "name": "price_data",
                    "table": "reddit_trending_with_prices",
                    "refs": [
                        {
                            "name": "price_data",
                            "table": "last_two_week_prices",
                            "refs": []
                        }
                    ]
                },
                {
                    "name": "last_update_time",
                    "table": "reddit_trending_with_prices",
                    "refs": [
                        {
                            "name": "last_update_time",
                            "table": "",
                            "refs": []
                        }
                    ]
                }
            ],
            "command": {
                "command": "sql-nav-link.openPath",
                "title": "reddit_trending_with_prices",
                "arguments": [
                    "E:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\reddit_trending_with_prices.sql"
                ]
            }
        },
        "refs": [
            {
                "model": {
                    "collapsibleState": 1,
                    "label": "reddit_seven_day_trending",
                    "name": "reddit_seven_day_trending",
                    "file_name": "reddit_seven_day_trending.sql",
                    "file_path": "E:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\reddit_seven_day_trending.sql",
                    "table_names": [
                        "recent_reddit",
                        "bors_info"
                    ],
                    "columns": [
                        {
                            "name": "COUNT",
                            "table": "reddit_seven_day_trending",
                            "refs": [
                                {
                                    "name": "split_ins_id",
                                    "table": "recent_reddit",
                                    "refs": []
                                }
                            ]
                        },
                        {
                            "name": "JSON_AGG",
                            "table": "reddit_seven_day_trending",
                            "refs": [
                                {
                                    "name": "created_utc",
                                    "table": "recent_reddit",
                                    "refs": []
                                },
                                {
                                    "name": "sub",
                                    "table": "recent_reddit",
                                    "refs": []
                                }
                            ]
                        },
                        {
                            "name": "instid",
                            "table": "reddit_seven_day_trending",
                            "refs": [
                                {
                                    "name": "instid",
                                    "table": "bors_info",
                                    "refs": []
                                }
                            ]
                        },
                        {
                            "name": "orderbookid",
                            "table": "reddit_seven_day_trending",
                            "refs": [
                                {
                                    "name": "orderbookid",
                                    "table": "bors_info",
                                    "refs": []
                                }
                            ]
                        },
                        {
                            "name": "tickersymbol",
                            "table": "reddit_seven_day_trending",
                            "refs": [
                                {
                                    "name": "tickersymbol",
                                    "table": "bors_info",
                                    "refs": []
                                }
                            ]
                        },
                        {
                            "name": "name",
                            "table": "reddit_seven_day_trending",
                            "refs": [
                                {
                                    "name": "name",
                                    "table": "bors_info",
                                    "refs": []
                                }
                            ]
                        }
                    ],
                    "command": {
                        "command": "sql-nav-link.openPath",
                        "title": "reddit_seven_day_trending",
                        "arguments": [
                            "E:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\reddit_seven_day_trending.sql"
                        ]
                    }
                },
                "refs": [
                    {
                        "model": {
                            "collapsibleState": 1,
                            "label": "recent_reddit",
                            "name": "recent_reddit",
                            "file_name": "recent_reddit.sql",
                            "file_path": "E:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_reddit.sql",
                            "table_names": [
                                "reddit"
                            ],
                            "columns": [
                                {
                                    "name": "created_utc",
                                    "table": "recent_reddit",
                                    "refs": [
                                        {
                                            "name": "created_utc",
                                            "table": "reddit",
                                            "refs": []
                                        }
                                    ]
                                },
                                {
                                    "name": "sub",
                                    "table": "recent_reddit",
                                    "refs": [
                                        {
                                            "name": "sub",
                                            "table": "reddit",
                                            "refs": []
                                        }
                                    ]
                                },
                                {
                                    "name": "split_ins_id",
                                    "table": "recent_reddit",
                                    "refs": [
                                        {
                                            "name": "ins_id",
                                            "table": "reddit",
                                            "refs": []
                                        }
                                    ]
                                }
                            ],
                            "command": {
                                "command": "sql-nav-link.openPath",
                                "title": "recent_reddit",
                                "arguments": [
                                    "E:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_reddit.sql"
                                ]
                            }
                        },
                        "refs": [
                            {
                                "model": {
                                    "name": "reddit",
                                    "file_name": "",
                                    "file_path": "",
                                    "table_names": [],
                                    "columns": [
                                        {
                                            "name": "created_utc",
                                            "table": "reddit",
                                            "refs": []
                                        },
                                        {
                                            "name": "sub",
                                            "table": "reddit",
                                            "refs": []
                                        },
                                        {
                                            "name": "ins_id",
                                            "table": "reddit",
                                            "refs": []
                                        }
                                    ]
                                },
                                "refs": [],
                                "fields": [
                                    "created_utc",
                                    "sub",
                                    "ins_id"
                                ]
                            }
                        ],
                        "fields": [
                            "created_utc",
                            "sub",
                            "split_ins_id"
                        ]
                    },
                    {
                        "model": {
                            "name": "bors_info",
                            "file_name": "",
                            "file_path": "",
                            "table_names": [],
                            "columns": [
                                {
                                    "name": "instid",
                                    "table": "bors_info",
                                    "refs": []
                                },
                                {
                                    "name": "orderbookid",
                                    "table": "bors_info",
                                    "refs": []
                                },
                                {
                                    "name": "tickersymbol",
                                    "table": "bors_info",
                                    "refs": []
                                },
                                {
                                    "name": "name",
                                    "table": "bors_info",
                                    "refs": []
                                }
                            ]
                        },
                        "refs": [],
                        "fields": [
                            "instid",
                            "orderbookid",
                            "tickersymbol",
                            "name"
                        ]
                    }
                ],
                "fields": [
                    "COUNT",
                    "JSON_AGG",
                    "instid",
                    "orderbookid",
                    "tickersymbol",
                    "name"
                ]
            },
            {
                "model": {
                    "collapsibleState": 1,
                    "label": "reddit_seven_day_trending_two",
                    "name": "reddit_seven_day_trending_two",
                    "file_name": "reddit_seven_day_trending_two.sql",
                    "file_path": "E:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\reddit_seven_day_trending_two.sql",
                    "table_names": [
                        "recent_reddit",
                        "bors_info"
                    ],
                    "columns": [
                        {
                            "name": "COUNT",
                            "table": "reddit_seven_day_trending_two",
                            "refs": [
                                {
                                    "name": "split_ins_id",
                                    "table": "recent_reddit",
                                    "refs": []
                                }
                            ]
                        },
                        {
                            "name": "JSON_AGG",
                            "table": "reddit_seven_day_trending_two",
                            "refs": [
                                {
                                    "name": "created_utc",
                                    "table": "recent_reddit",
                                    "refs": []
                                },
                                {
                                    "name": "sub",
                                    "table": "recent_reddit",
                                    "refs": []
                                }
                            ]
                        },
                        {
                            "name": "instid",
                            "table": "reddit_seven_day_trending_two",
                            "refs": [
                                {
                                    "name": "instid",
                                    "table": "bors_info",
                                    "refs": []
                                }
                            ]
                        },
                        {
                            "name": "orderbookid",
                            "table": "reddit_seven_day_trending_two",
                            "refs": [
                                {
                                    "name": "orderbookid",
                                    "table": "bors_info",
                                    "refs": []
                                }
                            ]
                        },
                        {
                            "name": "tickersymbol",
                            "table": "reddit_seven_day_trending_two",
                            "refs": [
                                {
                                    "name": "tickersymbol",
                                    "table": "bors_info",
                                    "refs": []
                                }
                            ]
                        },
                        {
                            "name": "name",
                            "table": "reddit_seven_day_trending_two",
                            "refs": [
                                {
                                    "name": "name",
                                    "table": "bors_info",
                                    "refs": []
                                }
                            ]
                        }
                    ],
                    "command": {
                        "command": "sql-nav-link.openPath",
                        "title": "reddit_seven_day_trending_two",
                        "arguments": [
                            "E:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\reddit_seven_day_trending_two.sql"
                        ]
                    }
                },
                "refs": [
                    {
                        "model": {
                            "collapsibleState": 1,
                            "label": "recent_reddit",
                            "name": "recent_reddit",
                            "file_name": "recent_reddit.sql",
                            "file_path": "E:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_reddit.sql",
                            "table_names": [
                                "reddit"
                            ],
                            "columns": [
                                {
                                    "name": "created_utc",
                                    "table": "recent_reddit",
                                    "refs": [
                                        {
                                            "name": "created_utc",
                                            "table": "reddit",
                                            "refs": []
                                        }
                                    ]
                                },
                                {
                                    "name": "sub",
                                    "table": "recent_reddit",
                                    "refs": [
                                        {
                                            "name": "sub",
                                            "table": "reddit",
                                            "refs": []
                                        }
                                    ]
                                },
                                {
                                    "name": "split_ins_id",
                                    "table": "recent_reddit",
                                    "refs": [
                                        {
                                            "name": "ins_id",
                                            "table": "reddit",
                                            "refs": []
                                        }
                                    ]
                                }
                            ],
                            "command": {
                                "command": "sql-nav-link.openPath",
                                "title": "recent_reddit",
                                "arguments": [
                                    "E:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_reddit.sql"
                                ]
                            }
                        },
                        "refs": [
                            {
                                "model": {
                                    "name": "reddit",
                                    "file_name": "",
                                    "file_path": "",
                                    "table_names": [],
                                    "columns": [
                                        {
                                            "name": "created_utc",
                                            "table": "reddit",
                                            "refs": []
                                        },
                                        {
                                            "name": "sub",
                                            "table": "reddit",
                                            "refs": []
                                        },
                                        {
                                            "name": "ins_id",
                                            "table": "reddit",
                                            "refs": []
                                        }
                                    ]
                                },
                                "refs": [],
                                "fields": [
                                    "created_utc",
                                    "sub",
                                    "ins_id"
                                ]
                            }
                        ],
                        "fields": [
                            "created_utc",
                            "sub",
                            "split_ins_id"
                        ]
                    },
                    {
                        "model": {
                            "name": "bors_info",
                            "file_name": "",
                            "file_path": "",
                            "table_names": [],
                            "columns": [
                                {
                                    "name": "instid",
                                    "table": "bors_info",
                                    "refs": []
                                },
                                {
                                    "name": "orderbookid",
                                    "table": "bors_info",
                                    "refs": []
                                },
                                {
                                    "name": "tickersymbol",
                                    "table": "bors_info",
                                    "refs": []
                                },
                                {
                                    "name": "name",
                                    "table": "bors_info",
                                    "refs": []
                                }
                            ]
                        },
                        "refs": [],
                        "fields": [
                            "instid",
                            "orderbookid",
                            "tickersymbol",
                            "name"
                        ]
                    }
                ],
                "fields": [
                    "COUNT",
                    "JSON_AGG",
                    "instid",
                    "orderbookid",
                    "tickersymbol",
                    "name"
                ]
            },
            {
                "model": {
                    "name": "",
                    "file_name": "",
                    "file_path": "",
                    "table_names": [],
                    "columns": [
                        {
                            "name": "status",
                            "table": "",
                            "refs": []
                        },
                        {
                            "name": "last_update_time",
                            "table": "",
                            "refs": []
                        }
                    ]
                },
                "refs": [],
                "fields": []
            },
            {
                "model": {
                    "collapsibleState": 1,
                    "label": "last_two_week_prices",
                    "name": "last_two_week_prices",
                    "file_name": "last_two_week_prices.sql",
                    "file_path": "E:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\last_two_week_prices.sql",
                    "table_names": [
                        "recent_prices"
                    ],
                    "columns": [
                        {
                            "name": "ins_id",
                            "table": "last_two_week_prices",
                            "refs": [
                                {
                                    "name": "ins_id",
                                    "table": "recent_prices",
                                    "refs": []
                                }
                            ]
                        },
                        {
                            "name": "price_data",
                            "table": "last_two_week_prices",
                            "refs": [
                                {
                                    "name": "low_price",
                                    "table": "recent_prices",
                                    "refs": []
                                },
                                {
                                    "name": "high_price",
                                    "table": "recent_prices",
                                    "refs": []
                                },
                                {
                                    "name": "open_price",
                                    "table": "recent_prices",
                                    "refs": []
                                },
                                {
                                    "name": "trade_date",
                                    "table": "recent_prices",
                                    "refs": []
                                },
                                {
                                    "name": "close_price",
                                    "table": "recent_prices",
                                    "refs": []
                                }
                            ]
                        }
                    ],
                    "command": {
                        "command": "sql-nav-link.openPath",
                        "title": "last_two_week_prices",
                        "arguments": [
                            "E:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\last_two_week_prices.sql"
                        ]
                    }
                },
                "refs": [
                    {
                        "model": {
                            "collapsibleState": 1,
                            "label": "recent_prices",
                            "name": "recent_prices",
                            "file_name": "recent_prices.sql",
                            "file_path": "E:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_prices.sql",
                            "table_names": [
                                "bors_prices"
                            ],
                            "columns": [
                                {
                                    "name": "trade_date",
                                    "table": "recent_prices",
                                    "refs": [
                                        {
                                            "name": "trade_date",
                                            "table": "bors_prices",
                                            "refs": []
                                        }
                                    ]
                                },
                                {
                                    "name": "ins_id",
                                    "table": "recent_prices",
                                    "refs": [
                                        {
                                            "name": "ins_id",
                                            "table": "bors_prices",
                                            "refs": []
                                        }
                                    ]
                                },
                                {
                                    "name": "high_price",
                                    "table": "recent_prices",
                                    "refs": [
                                        {
                                            "name": "high_price",
                                            "table": "bors_prices",
                                            "refs": []
                                        }
                                    ]
                                },
                                {
                                    "name": "low_price",
                                    "table": "recent_prices",
                                    "refs": [
                                        {
                                            "name": "low_price",
                                            "table": "bors_prices",
                                            "refs": []
                                        }
                                    ]
                                },
                                {
                                    "name": "open_price",
                                    "table": "recent_prices",
                                    "refs": [
                                        {
                                            "name": "open_price",
                                            "table": "bors_prices",
                                            "refs": []
                                        }
                                    ]
                                },
                                {
                                    "name": "close_price",
                                    "table": "recent_prices",
                                    "refs": [
                                        {
                                            "name": "close_price",
                                            "table": "bors_prices",
                                            "refs": []
                                        }
                                    ]
                                },
                                {
                                    "name": "volume",
                                    "table": "recent_prices",
                                    "refs": [
                                        {
                                            "name": "volume",
                                            "table": "bors_prices",
                                            "refs": []
                                        }
                                    ]
                                }
                            ],
                            "command": {
                                "command": "sql-nav-link.openPath",
                                "title": "recent_prices",
                                "arguments": [
                                    "E:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_prices.sql"
                                ]
                            }
                        },
                        "refs": [
                            {
                                "model": {
                                    "name": "bors_prices",
                                    "file_name": "",
                                    "file_path": "",
                                    "table_names": [],
                                    "columns": [
                                        {
                                            "name": "trade_date",
                                            "table": "bors_prices",
                                            "refs": []
                                        },
                                        {
                                            "name": "ins_id",
                                            "table": "bors_prices",
                                            "refs": []
                                        },
                                        {
                                            "name": "high_price",
                                            "table": "bors_prices",
                                            "refs": []
                                        },
                                        {
                                            "name": "low_price",
                                            "table": "bors_prices",
                                            "refs": []
                                        },
                                        {
                                            "name": "open_price",
                                            "table": "bors_prices",
                                            "refs": []
                                        },
                                        {
                                            "name": "close_price",
                                            "table": "bors_prices",
                                            "refs": []
                                        },
                                        {
                                            "name": "volume",
                                            "table": "bors_prices",
                                            "refs": []
                                        }
                                    ]
                                },
                                "refs": [],
                                "fields": [
                                    "trade_date",
                                    "ins_id",
                                    "high_price",
                                    "low_price",
                                    "open_price",
                                    "close_price",
                                    "volume"
                                ]
                            }
                        ],
                        "fields": [
                            "trade_date",
                            "ins_id",
                            "high_price",
                            "low_price",
                            "open_price",
                            "close_price",
                            "volume"
                        ]
                    }
                ],
                "fields": [
                    "ins_id",
                    "price_data"
                ]
            }
        ]
    },
    "rightRefs": [],
    "size_left": "3",
    "size_right": "2"
}