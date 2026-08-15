

export const testDataReverse = {
    "centerModel": {
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
                "fields": []
            }
        ]
    },
    "rightRefs": [
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
                                "name": "close_price",
                                "table": "recent_prices",
                                "refs": []
                            },
                            {
                                "name": "trade_date",
                                "table": "recent_prices",
                                "refs": []
                            },
                            {
                                "name": "low_price",
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
                        "label": "group_day_holding_with_bors",
                        "name": "group_day_holding_with_bors",
                        "file_name": "group_day_holding_with_bors.sql",
                        "file_path": "E:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\group_day_holding_with_bors.sql",
                        "table_names": [
                            "bors_info",
                            "group_holding_day",
                            "last_two_week_prices"
                        ],
                        "columns": [
                            {
                                "name": "averageacquiredprice",
                                "table": "group_day_holding_with_bors",
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
                                "table": "group_day_holding_with_bors",
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
                                "table": "group_day_holding_with_bors",
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
                                "table": "group_day_holding_with_bors",
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
                                "table": "group_day_holding_with_bors",
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
                                "table": "group_day_holding_with_bors",
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
                                "table": "group_day_holding_with_bors",
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
                                "table": "group_day_holding_with_bors",
                                "refs": [
                                    {
                                        "name": "instid",
                                        "table": "bors_info",
                                        "refs": []
                                    }
                                ]
                            },
                            {
                                "name": "price_data",
                                "table": "group_day_holding_with_bors",
                                "refs": [
                                    {
                                        "name": "price_data",
                                        "table": "last_two_week_prices",
                                        "refs": []
                                    },
                                    {
                                        "name": "p_entry",
                                        "table": "ghp",
                                        "refs": []
                                    },
                                    {
                                        "name": "day_data",
                                        "table": "ghp",
                                        "refs": []
                                    }
                                ]
                            }
                        ],
                        "command": {
                            "command": "sql-nav-link.openPath",
                            "title": "group_day_holding_with_bors",
                            "arguments": [
                                "E:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\group_day_holding_with_bors.sql"
                            ]
                        }
                    },
                    "refs": [],
                    "fields": []
                },
                {
                    "model": {
                        "collapsibleState": 1,
                        "label": "last_two_week_holdings",
                        "name": "last_two_week_holdings",
                        "file_name": "last_two_week_holdings.sql",
                        "file_path": "E:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\last_two_week_holdings.sql",
                        "table_names": [
                            "bors_info",
                            "grouped_holdings",
                            "last_two_week_prices"
                        ],
                        "columns": [
                            {
                                "name": "instrumentid",
                                "table": "last_two_week_holdings",
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
                                "table": "last_two_week_holdings",
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
                                "table": "last_two_week_holdings",
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
                                "table": "last_two_week_holdings",
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
                                "table": "last_two_week_holdings",
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
                                "table": "last_two_week_holdings",
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
                                "table": "last_two_week_holdings",
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
                                "table": "last_two_week_holdings",
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
                            "title": "last_two_week_holdings",
                            "arguments": [
                                "E:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\last_two_week_holdings.sql"
                            ]
                        }
                    },
                    "refs": [],
                    "fields": []
                },
                {
                    "model": {
                        "collapsibleState": 1,
                        "label": "reddit_trending_with_prices",
                        "name": "reddit_trending_with_prices",
                        "file_name": "reddit_trending_with_prices.sql",
                        "file_path": "E:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\reddit_trending_with_prices.sql",
                        "table_names": [
                            "reddit_seven_day_trending_two",
                            "reddit_seven_day_trending",
                            "last_two_week_prices"
                        ],
                        "columns": [
                            {
                                "name": "count",
                                "table": "reddit_trending_with_prices",
                                "refs": [
                                    {
                                        "name": "COUNT",
                                        "table": "reddit_seven_day_trending_two",
                                        "refs": []
                                    },
                                    {
                                        "name": "COUNT",
                                        "table": "reddit_seven_day_trending",
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
                                        "table": "reddit_seven_day_trending_two",
                                        "refs": []
                                    },
                                    {
                                        "name": "JSON_AGG",
                                        "table": "reddit_seven_day_trending",
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
                                        "table": "reddit_seven_day_trending_two",
                                        "refs": []
                                    },
                                    {
                                        "name": "instid",
                                        "table": "reddit_seven_day_trending",
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
                                        "table": "reddit_seven_day_trending_two",
                                        "refs": []
                                    },
                                    {
                                        "name": "name",
                                        "table": "reddit_seven_day_trending",
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
                    "refs": [],
                    "fields": []
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
    "size_right": "3"
}

export const testData = {
    "centerModel": {
        "model": {
            "collapsibleState": 1,
            "label": "reddit_seven_day_trending_two",
            "name": "reddit_seven_day_trending_two",
            "file_name": "reddit_seven_day_trending_two.sql",
            "file_path": "E:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\reddit_seven_day_trending_two.sql",
            "table_names": [
                "bors_info",
                "recent_reddit"
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
                            "name": "sub",
                            "table": "recent_reddit",
                            "refs": []
                        },
                        {
                            "name": "created_utc",
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
                "fields": []
            }
        ]
    },
    "rightRefs": [
        {
            "model": {
                "collapsibleState": 1,
                "label": "reddit_trending_with_prices",
                "name": "reddit_trending_with_prices",
                "file_name": "reddit_trending_with_prices.sql",
                "file_path": "E:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\reddit_trending_with_prices.sql",
                "table_names": [
                    "last_two_week_prices",
                    "reddit_seven_day_trending",
                    "reddit_seven_day_trending_two"
                ],
                "columns": [
                    {
                        "name": "count",
                        "table": "reddit_trending_with_prices",
                        "refs": [
                            {
                                "name": "COUNT",
                                "table": "reddit_seven_day_trending_two",
                                "refs": []
                            },
                            {
                                "name": "COUNT",
                                "table": "reddit_seven_day_trending",
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
                                "table": "reddit_seven_day_trending_two",
                                "refs": []
                            },
                            {
                                "name": "JSON_AGG",
                                "table": "reddit_seven_day_trending",
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
                                "table": "reddit_seven_day_trending_two",
                                "refs": []
                            },
                            {
                                "name": "instid",
                                "table": "reddit_seven_day_trending",
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
            "refs": [],
            "fields": [
                "COUNT",
                "JSON_AGG",
                "instid",
                "orderbookid",
                "tickersymbol",
                "name"
            ]
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