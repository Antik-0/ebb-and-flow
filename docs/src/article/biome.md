# Biome 配置

:::info

[传送门](https://biomejs.dev/zh-cn/guides/getting-started/)

:::

## source

```json
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "files": {
    "includes": [
      "package.json",
      "tsconfig.json",
      "!**/node_modules",
      "!**/dist",
      "!biome.json"
    ]
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "a11y": {
        "noStaticElementInteractions": "off",
        "useValidAnchor": "off",
        "useKeyWithClickEvents": "off"
      },
      "correctness": {
        "useExhaustiveDependencies": "off",
        "noUnusedImports": {
          "level": "error",
          "fix": "safe"
        }
      },
      "style": {
        "noNonNullAssertion": "off",
        "useNumberNamespace": {
          "level": "info",
          "fix": "safe"
        },
        "useNumericSeparators": "error",
        "useSelfClosingElements": {
          "level": "warn",
          "fix": "safe",
          "options": {
            "ignoreHtmlElements": true
          }
        },
        "useTemplate": "off"
      },
      "suspicious": {
        "noExplicitAny": "off",
        "noAssignInExpressions": "off"
      }
    }
  },
  "assist": {
    "enabled": true,
    "actions": {
      "source": {
        "organizeImports": {
          "level": "on",
          "options": {
            "groups": [
              {
                "type": true
              }
            ]
          }
        },
        "useSortedAttributes": "on"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "formatWithErrors": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "none",
      "semicolons": "asNeeded",
      "arrowParentheses": "asNeeded"
    }
  },
  "css": {
    "formatter": {
      "quoteStyle": "single"
    }
  },
  "overrides": [
    {
      "includes": ["**/*.vue"],
      "linter": {
        "rules": {
          "style": {
            "useConst": "off",
            "useImportType": "off"
          },
          "correctness": {
            "noUnusedVariables": "off",
            "noUnusedImports": "off"
          }
        }
      }
    }
  ]
}

```
