# Biome 配置

## source

[reference](https://biomejs.dev/zh-cn/guides/getting-started/)

```json
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "files": {
    "ignoreUnknown": true,
    "includes": [
      ".vscode/*",
      "src/**/*",
      "scripts/*",
      "package.json",
      "tsconfig.json",
      "!**/dist",
      "!**/node_modules",
      "!biome.json"
    ]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80
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
        "useTemplate": {
          "level": "info",
          "fix": "safe"
        }
      },
      "suspicious": {
        "noExplicitAny": "off"
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
            "groups": [{ "type": true }]
          }
        },
        "useSortedAttributes": "on"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "none",
      "semicolons": "asNeeded"
    }
  },
  "graphql": {
    "formatter": {
      "enabled": true,
      "indentStyle": "tab"
    }
  }
}
```
