# Json2Html
Create Html Form with Json file.
### Technical Specification

#### Json Specification creator HTML

- "Layout" is key name of main json.
  - "csspath" set css to be used.
  - "charset" set charset to be used.
  - "Sessions" is an array and create nav components.
    - "Fields" is an array that contain specitication to create form components.
      - "name" set id DOM html
      - "type" determines the component that will be used at creation.
      - "required" determines if component is required.
      - "validation" determines how to data will be test.

#### Type component

- "text"
- "radio"
- "list"
- "checkbox"

#### Validation

- "Email"

#### Dependencies

It's possible create combolist that

#### Event Function
- nextSession() - call this method to go next session.
- previousSession() - call this method to go older session.


#### Examples
This is valid example json to specification creating text component.
```sh
{
  "csspath":"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css",
  "charset": "utf-8",
	"layout": {
		"sessions": [{
			"fields": [{
				"name": "CPF",
				"label": "CPF: ",
				"type": "text",
				"required": true,
				"validation": "CPF"
			}]
		}]
	}
}
```

### Installation
- Create file html containing div tag with id "containerForm" and add script.

```sh
...
<body>
<script src="json2html.js"></script>
<div id="containerForm">
</div>
</body>
...
```
- If you want use validation, you need add new line containing script validation file.

```sh
...
<body>
<script src="json2html.js"></script>
<script src="validation-BR.js"></script>
<div id="containerForm">
</div>
</body>
...
```

### Fast Test

You can test json2Html using node to up service and access on: http://localhost:3000/

```sh
git clone https://github.com/othondev/json2html.git
cd json2html
node server.js
```
### License
MIT
