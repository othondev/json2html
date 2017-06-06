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

The validation needs "validateJS" key's json set on with below. The "validation-BR.js" needs have validation method corresponding to the key "validation" that is inside the key "fields"

```sh
{
  "validateJS" : "validation-BR.js"
  "csspath":"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css",
  "charset": "utf-8",
	"layout": {
		"sessions": [{
			"fields": [{
				"name": "phone",
				"label": "Phone: ",
				"type": "text",
				"required": true,
				"validation": "isNumber"
			}]
		}]
	}
}
```

The file validation-BR.js should to have name method equal value validation key.
```sh
//file validation-BR.js
...
function isNumber(num){
  return !isNaN(num);
}
```

#### Values Dependencies

It's possible create dependency relationship between values using "dependency" key. This feature is only enable to "list" type. In example below, the select "sportname" only show the values: "Swimming" and "synchronized swimming" whether "categorysports" componet have value: "Water".
```sh
{
  "label": "What is sport you like as?",
  "name": "sportname",
  "type": "list",
  "values": [{
      "name": "Swimming",
      "dependency": [{"id":"categorysports", "value": "Water"}]
    },
    {
        "name": "synchronized swimming",
        "dependency": [{"id":"categorysports", "value": "Water"}]
      },
      {
        "name": "Soccer",
        "dependency": [{"id":"categorysports", "value": "Earth"}]
      },
      {
        "name": "Running",
        "dependency": [{"id":"categorysports", "value": "Earth"}]
      }
  ]
}
```
##### Multi Dependencies
It's also possible create value with multi dependencies.

```sh
{
  "name": "Both",
  "dependency": [{"id":"degree", "value": "Graduate"},{"id":"degree", "value": "Undergraduate"}]
}
```

#### Event Function
- nextSession() - call this method to go next session. If data form no valid a excption is throwed.
- previousSession() - call this method to go older session. If data form no valid a excption is throwed.
- goToSession(index) - call this method to go specific session. If data form no valid a excption is throwed.
- getResult() - call this method to reciever current values of form.

#### Result

You can call getResult() anytime to return values parcial of form. It method return a json containing "name" and "value" to each component created.
The result will return on element or array as example below.

```sh
{  
   "CPF":"02136551361",
   "degree":"Graduate",
   "level":"High School Diploma",
   "county":"Italian",
   "categorysports":[  
      "Water",
      "Earth"
   ],
   "sportname":"Running",
   "Facudade 3":"sdadsad",
   "Email":"othon@gsdsd.com",
   "Facudade 1":"sdasddasdsad"
}
```


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
