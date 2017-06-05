var index =-1;
var sessions;
var errors = 0;
var result = {};
    function reciverJsonAndRetunHTML (json) {
      json = json.layout;
      sessions = json.sessions;
      setHeaderAndMainDivAndForm(json);
      makePagination(json.sessions);
      nextSession(index);
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

    if(item.required && item.type === "text" && !divComponentLayout.classList.contains("has-error")){
      divComponentLayout.classList.add("has-error");
      errors ++;
    }

    divComponentLayout.addEventListener("keyup",function(layout){
      if(item.required){
        if(layout.target.value === ""&& !divComponentLayout.classList.contains("has-error")){
          divComponentLayout.classList.add("has-error");
          errors ++;
        }else{
            if(validate(item.validation, layout.target.value)&&divComponentLayout.classList.contains("has-error")){
              divComponentLayout.classList.remove("has-error");
              errors --;
            }
            else{
              if(!divComponentLayout.classList.contains("has-error")){
                divComponentLayout.classList.add("has-error");
                errors ++;
              }
            }

        }
      }else{
        if(layout.target.value !== ""){
          if(validate(item.validation, layout.target.value) && divComponentLayout.classList.contains("has-error")){
            divComponentLayout.classList.remove("has-error");
            errors --;
          }
          else {
            if(!divComponentLayout.classList.contains("has-error")){
              divComponentLayout.classList.add("has-error");
              errors ++;
            }

          }
        }else{
          if(divComponentLayout.classList.contains("has-error")){
            divComponentLayout.classList.remove("has-error");
            errors --;
          }
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
function updateSelect(jsonItem,selectDOM){
  var idSelect = '';
  selectDOM.innerHTML = '';
  jsonItem.values.forEach(function (item) {
    if(containsDependecies(item.dependency)){
      var op = new Option(item.name);
      if(result[jsonItem.name] && result[jsonItem.name].includes(item.name)) op.selected = true;
      selectDOM.options.add(op);
    }

  });
}

  function createDOMSelect(jsonItem){
    var selectDOM = document.createElement("SELECT");
    var listObserved = listIDObserved(jsonItem);
    updateSelect(jsonItem,selectDOM);
    listObserved.forEach(function (listObservedItem) {
      var observer = document.getElementById(listObservedItem);
      observer.addEventListener("change",function(event) {
        updateSelect(jsonItem,selectDOM);
      });
    });
    return selectDOM;
  }
  function listIDObserved(jsonItem){
    var listObserved = [];
    jsonItem.values.forEach(function (itemDep) {
    var list = itemDep.dependency;
    if(list)
    list.forEach(function (item) {
      if(!listObserved.includes(item.id)){
        listObserved.push(item.id);
      }
    });
  });
  return listObserved;
}
  function containsDependecies(dependency){
    if(!dependency) return true;
    for (var i = 0; i < dependency.length; i++) {
      var id = dependency[i].id;
      var value = dependency[i].value;
      if(!getValueComponent(id).includes(value))
        return false;
    }
    return true;
  }
  function setAndGetFormElement(labelString,nameID,required){
    var innerForm = document.getElementById('innerForm');
    var innerFormDiv = document.createElement('div');
    innerFormDiv.classList.add('form-group');
    var label = document.createElement('label');
    required ? label.innerHTML = '*'+labelString : label.innerHTML = labelString;
    innerFormDiv.appendChild(label);
    innerFormDiv.id = nameID;
    innerForm.appendChild(innerFormDiv);
    innerFormDiv.addEventListener("change",function(event){
      setResultOnComponentChange(event.target);
    });

    return innerFormDiv;
  }

  function setResultOnComponentChange (target){
    var idParent = findIdParent(target);
    result[idParent] = getValueComponent(idParent);
  }

  function getValueComponent(idParent){
    var itemDOM = document.getElementById(idParent);
    if(itemDOM.value){
      return itemDOM.value;
    }
    var tempResul = [];
    itemDOM.querySelectorAll('[type="checkbox"]:checked, [type="radio"]:checked, [type="text"], option:checked').forEach(function (item) {
      tempResul.push(item.value);
    });
    return tempResul.length == 1 ? tempResul[0] : tempResul ;
  }

  function findIdParent(target) {
    if(target.id){
      return target.id;
    }else{
      return findIdParent(target.parentElement);
    }
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

      if(result[item.name] && result[item.name].includes(inputRadio.value))
        inputRadio.checked = true;

      radioLabel.appendChild(inputRadio);

      var textCon = document.createTextNode(itemRadio.name);
      radioLabel.appendChild(textCon);


    });
    return container;
  }

  function createDOMTextField(item){
    var textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.classList.add('form-control');

    if(result[item.name]){
      textInput.value = result[item.name];
    }

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

    var validateScript = document.createElement('script');
    validateScript.src = json.validateJS;
    document.getElementsByTagName('head')[0].appendChild(validateScript);

  }
  function nextSession(){
    if(errors >0) throw new Error('Datas no valid. Check the form!');
    errors = 0;
    if(index < sessions.length -1) index += 1;
    goToSession(index);
  }
  function previousSession(){
    if(errors >0) throw new Error('Datas no valid. Check the form!');
    errors = 0;
    if(index > 0) index -= 1;
    goToSession(index);
  }
  function goToSession(index){
    if(errors >0) throw new Error('Datas no valid. Check the form!');
    var itemChild = document.getElementById("session_ul").childNodes;
    itemChild[index].classList.add('active');
    var myNode = document.getElementById("innerForm");
    myNode.innerHTML = '';
    makeForm(sessions[index]);
  }
  function validate(nameMethod,text){
    try{
      if(nameMethod)
        return window[nameMethod](text);
      else
        return true;
    }catch(err){
      console.error('The ' + nameMethod + ' method not found in validation file');
    }
  }
  function getJson(){
    return JSON.stringify(result);
  }
