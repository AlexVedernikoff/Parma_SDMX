// 1.  (!) Компонент, который рендерит форму
// src\web\components\artefacts\card\concepts\artefact\index.js

// 2.  Список НАЗВАНИЙ полей для формы мы получаем при помощи функции
getListFields(mode, initialValues);
// src\web\components\artefacts\card\concepts\artefact\listFields.js

// 3. Значения values мы получаем при помощи этого хука
const { values, initialValues, handleChangeFormField } = useArtefactValuesContext();

export function useArtefactValuesContext() {
  return useContext(ArtefactValueContext);
}

// ************************************************************
// 4. форма создаётся при помощи компонента Form из библиотеки antd.
<Form
  form={form}
  fields={getListFields(mode, initialValues)}
  values={values}
  onChange={onChangeForm}
/>;

// ************************************************************
// 5. Эта функция получает нужные нам значения
getInitialValues(type);
// src\web\components\artefacts\card\utils\get-initial-values.js
// getInitialValues(type) type =  conceptscheme
// getInitialValues(type) type =  datastructure
// getInitialValues(type) type =  dataflow
// getInitialValues(type) type =  contentconstraint
// ************************************************************
// 6. В этом файле прописываем значения по-умолчанию

// *** "Схема концептов " ***
// src\web\components\artefacts\card\concepts\lib\constants.js
// *** "Список кодов" ***
// src\web\components\artefacts\card\codelist\lib\constants.js
// *** "Определение структуры данных" ***
// src\web\components\artefacts\card\datastructure\lib\constants.js
// *** "Поток данных" ***
// src\web\components\artefacts\card\datastructure\lib\constants.js
