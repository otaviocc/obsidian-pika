import tseslint from 'typescript-eslint';
import obsidianmd from "eslint-plugin-obsidianmd";
import globals from "globals";
import { globalIgnores } from "eslint/config";

export default tseslint.config(
	{
		languageOptions: {
			globals: {
				...globals.browser,
			},
			parserOptions: {
				projectService: {
					allowDefaultProject: [
						'eslint.config.mts',
						'manifest.json'
					]
				},
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: ['.json']
			},
		},
	},
	...obsidianmd.configs.recommended,
	{
		files: ["**/*.ts"],
		plugins: {
			"@typescript-eslint": tseslint.plugin,
		},
		rules: {
			"@typescript-eslint/no-unused-vars": ["error", {
				"args": "none",
				"varsIgnorePattern": "^_",
				"argsIgnorePattern": "^_",
				"caughtErrorsIgnorePattern": "^_"
			}],
			"@typescript-eslint/ban-ts-comment": "off",
			"@typescript-eslint/no-empty-function": "off",
			"@typescript-eslint/no-unused-expressions": "error",
			"@typescript-eslint/no-useless-constructor": "warn",
			"@typescript-eslint/require-await": "error",
			"@typescript-eslint/member-ordering": ["error", {
				"default": {
					"memberTypes": [
						"signature",
						"public-static-field",
						"protected-static-field",
						"private-static-field",
						"public-decorated-field",
						"protected-decorated-field",
						"private-decorated-field",
						"public-instance-field",
						"protected-instance-field",
						"private-instance-field",
						"public-abstract-field",
						"protected-abstract-field",
						"public-constructor",
						"protected-constructor",
						"private-constructor",
						"public-static-method",
						"protected-static-method",
						"private-static-method",
						"public-decorated-method",
						"protected-decorated-method",
						"private-decorated-method",
						"public-instance-method",
						"protected-instance-method",
						"private-instance-method",
						"public-abstract-method",
						"protected-abstract-method"
					]
				}
			}],
			"no-unused-vars": "off",
			"no-prototype-builtins": "off",
			"semi": ["error", "never"],
			"no-trailing-spaces": "error",
			"no-multiple-empty-lines": ["error", { "max": 1 }],
			"eol-last": ["error", "always"],
			"no-multi-spaces": "error",
			"no-irregular-whitespace": "error",
			"no-whitespace-before-property": "error",
			"no-unreachable": "error",
			"no-unreachable-loop": "error",
			"no-console": "warn",
			"space-in-parens": ["error", "never"],
			"object-curly-spacing": ["error", "always"],
		}
	},
	globalIgnores([
		"node_modules",
		"build",
		"esbuild.config.mjs",
		"eslint.config.mts",
		"version-bump.mjs",
		"versions.json",
		"main.js",
	]),
);
