var index =-1;
var sessions;
    function reciverJsonAndRetunHTML (json) {
      json = json.layout;
      sessions = json.sessions;
      setHeaderAndMainDivAndForm(json);
      makePagination(json.sessions);
      onContinue(index);
    }

  function makePagination (jsonPagination) {
    var main = document.getElementById("main");
    var sessionContainerUL = document.createElement('nav');
    sessionContainerUL.classList.add('steps','clearfix','pagination');
    sessionContainerUL.id = 'session_ul';
    main.appendChild(sessionContainerUL);

    jsonPagination.forEach(function(item){
      var li_TAG = document.createElement('li');
      var a_TAG = document.createElement('a');
      var session_ul = document.getElementById("session_ul");
      a_TAG.innerHTML = item.name;
      li_TAG.appendChild(a_TAG);
      session_ul.appendChild(li_TAG);
    });

  }
  function setAndGetElementWithValidation(item,divComponentLayout){

    if(item.required && item.type === "text" )
      divComponentLayout.classList.add("has-error");


    divComponentLayout.addEventListener("keyup",function(layout){
      if(item.required){
        if(layout.target.value === ""){
          divComponentLayout.classList.add("has-error");
        }else{
            if(validate(item.validation, layout.target.value))
              divComponentLayout.classList.remove("has-error");
            else
              divComponentLayout.classList.add("has-error");
        }
      }else{
        if(layout.target.value !== ""){
          if(validate(item.validation, layout.target.value))
            divComponentLayout.classList.remove("has-error");
          else {
            divComponentLayout.classList.add("has-error");
          }
        }else{
          divComponentLayout.classList.remove("has-error");
        }
      }
    });
    return divComponentLayout;
  }
  function makeForm(session){
    var innerForm = document.getElementById('innerForm');
    session.fields.forEach(function(item){
      var divComponentLayout = setAndGetFormElement(item.label,item.name,item.required);

      divComponentLayout = setAndGetElementWithValidation(item,divComponentLayout);

      switch (item.type) {
        case 'text':
          divComponentLayout.appendChild(createDOMTextField(item));
          break;
        case 'radio' :
          divComponentLayout.appendChild(createDOMRadioGroup(item));
          break;
        case 'list' :
          divComponentLayout.appendChild(createDOMSelect(item));
          break;
        case 'checkbox':
          divComponentLayout.appendChild(createDOMCheckBox(item));
        default:

      }

    });
  }
  function createDOMCheckBox(item){
    return createDOMRadioOrCheckbox(item);
  }


  function createDOMSelect(item){
    var selectDOM = document.createElement("SELECT");

    item.values.forEach(function(itemValue){
      var dependencyID = itemValue.dependency.split('\.')[0];
      if(dependencyID){

        var itemDOM = document.getElementById(dependencyID);
        var context = this;
        itemDOM.addEventListener("change",function (context){

          selectDOM.innerHTML = '';

          var filter =[];

          itemDOM.querySelectorAll('[type="checkbox"]:checked, [type="radio"]:checked').forEach(function(item){
            filter.push(item.defaultValue);
          });

          var filtredList = item.values.filter(function (listItem) {
            var dependencyName = listItem.dependency.split('\.')[1];
            if(filter.includes(dependencyName))
              return listItem;
          });

          filtredList.forEach(function (item) {
            selectDOM.options.add(new Option(item.name));
          });

        });
      }
    });

    return selectDOM;
  }

  function setAndGetFormElement(labelString,nameID,required){
    var innerForm = document.getElementById('innerForm');
    var innerFormDiv = document.createElement('div');
    innerFormDiv.classList.add('form-group');
    var label = document.createElement('label');
    label.innerHTML = labelString;
    innerFormDiv.appendChild(label);
    innerFormDiv.id = nameID;
    innerForm.appendChild(innerFormDiv);

    return innerFormDiv;
  }
  function createDOMRadioGroup(item){
    return createDOMRadioOrCheckbox(item,true);
  }

  function createDOMRadioOrCheckbox(item,radio){
    var container = document.createElement('div');

    item.values.forEach(function(itemRadio){

      var radioLabel = document.createElement('label');
      radioLabel.classList.add('radio-inline');
      container.appendChild(radioLabel);

      var inputRadio = document.createElement('input');
      if(radio){
          inputRadio.type = 'radio';
      }else{
          inputRadio.type = 'checkbox';
      }
      inputRadio.name = 'optradio';
      inputRadio.value = itemRadio.name;
      radioLabel.appendChild(inputRadio);

      var textCon = document.createTextNode(itemRadio.name);
      radioLabel.appendChild(textCon);


    });

    return container;



  }

  function createDOMTextField(item){
    var textInput = document.createElement('input');
    textInput.classList.add('form-control');
    return textInput;
  }
  function setHeaderAndMainDivAndForm(json){
    var containerForm = document.getElementById('containerForm');
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = 'cssId';
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = json.csspath;
    link.media = 'all';
    head.appendChild(link);

    var meta = document.createElement('meta');
    meta.charset = json.charset;

    var innerLayout = document.createElement('div');
    innerLayout.id = 'main';
    innerLayout.classList.add('auto_layout');
    containerForm.appendChild(innerLayout);

    var innerForm = document.createElement('form');
    innerForm.id='innerForm';
    containerForm.appendChild(innerForm);

  }
  function onContinue(){
    index += 1;
    var itemChild = document.getElementById("session_ul").childNodes;
    itemChild[index].classList.add('active');
    var myNode = document.getElementById("innerForm");
    myNode.innerHTML = '';
    makeForm(sessions[index]);
  }
  function onFinishLater(){
    alert ('Previous');
  }
