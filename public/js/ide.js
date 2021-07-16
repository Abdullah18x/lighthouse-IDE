var defaultUrl = "http://0.0.0.0:80";
var apiUrl = defaultUrl;
var wait = localStorageGetItem("wait") || false;
var pbUrl = "https://pb.judge0.com";
var check_timeout = 200;

var blinkStatusLine = (localStorageGetItem("blink") || "true") === "true";
var editorMode = localStorageGetItem("editorMode") || "normal";
var redirectStderrToStdout =
  (localStorageGetItem("redirectStderrToStdout") || "false") === "true";
var editorModeObject = null;

var fontSize = 14;

var MonacoVim;
var MonacoEmacs;

var layout;

var sourceEditor;
var stdinEditor;
var stdoutEditor;
var stderrEditor;
var compileOutputEditor;
var sandboxMessageEditor;
var descriptionMessageEditor;

var isEditorDirty = false;
var currentLanguageId = 62;

var $selectLanguage = 62;
var $compilerOptions;
var $commandLineArguments;
var $insertTemplateBtn;
var $runBtn;
var submitBtn;
var $navigationMessage;
var $updates;
var $statusLine;

var timeStart;
var timeEnd;
var messagesData;

//My Variables
const startingDate = new Date();
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var lecturerId = urlParams.get("lecturerId");
var studentId = urlParams.get("studentId");
var assignmentId = urlParams.get("assignmentId");
let assignmentType = urlParams.get("assignmentType");
var userToken = urlParams.get("ide");
localStorageSetItem("token", userToken);
let userType = 0;
var assignedId = urlParams.get("assignedId");
let title = "";
let description = "";
let resourceLinks = "";
let assignment = "";
let dYear = "";
let dMonth = "";
let dDate = "";
let dHours = "";
let dMinutes = "";
let sourceCode = "";
let timeTaken = 0;
let codeResult = "";
let errors = [];
let numberOfErrors = 0;

//Assessment Variables
let ifC = 0;
let methods = 0;
let multipleClasses = 0;
let arrays = 0;
let dowhileL = 0;
let expectedAns = "";
let expectedAnsType = 0;
let forL = 0;
let switchC = 0;
let whileL = 0;

//Tempelates for assessment
let ifT = "if(){}";
let ieiT = "if(){}else{}";
let switchT = "switch(){case:break}";
let whileT = "while(){}";
let dowhileT = "do{}while()";
let forT = "for(){}";
let classT = "class{}";
let arraysT = "[]";

var layoutConfig = {
  settings: {
    showPopoutIcon: false,
    reorderEnabled: true,
  },
  dimensions: {
    borderWidth: 3,
    headerHeight: 22,
  },
  content: [
    {
      type: "row",
      content: [
        {
          type: "component",
          componentName: "source",
          title: "SOURCE",
          isClosable: false,
          componentState: {
            readOnly: false,
          },
        },
        {
          type: "column",
          content: [
            {
              type: "stack",
              content: [
                {
                  type: "component",
                  componentName: "stdin",
                  title: "STDIN",
                  isClosable: false,
                  componentState: {
                    readOnly: false,
                  },
                },
                {
                  type: "component",
                  componentName: "description",
                  title: "ASSIGNMENT DESCRIPTION",
                  isClosable: false,
                  componentState: {
                    readOnly: true,
                  },
                },
              ],
            },
            {
              type: "stack",
              content: [
                {
                  type: "component",
                  componentName: "stdout",
                  title: "STDOUT",
                  isClosable: false,
                  componentState: {
                    readOnly: true,
                  },
                },
                {
                  type: "component",
                  componentName: "stderr",
                  title: "STDERR",
                  isClosable: false,
                  componentState: {
                    readOnly: true,
                  },
                },
                {
                  type: "component",
                  componentName: "compile output",
                  title: "COMPILE OUTPUT",
                  isClosable: false,
                  componentState: {
                    readOnly: true,
                  },
                },
                {
                  type: "component",
                  componentName: "sandbox message",
                  title: "SANDBOX MESSAGE",
                  isClosable: false,
                  componentState: {
                    readOnly: true,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

function verification() {
  data = {
    userType: userType,
    token: userToken,
  };
  if (userToken != null || userToken != undefined) {
    $.ajax({
      url: "http://localhost:3010/verifyUserToken/validToken",
      type: "POST",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", userToken);
      },
      async: true,
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function (data, textStatus, jqXHR) {
        console.log(data);
        if (data.length < 1) {
          alert("Invalid Request");
          window.close();
        }
      },
      error: function (error) {
        console.log(error);
      },
    });
  } else {
    alert("Invalid Request");
    window.close();
  }
}

function checkIfAssignmentSubmitted() {
  data = {
    assignedId: assignedId,
    studentId: studentId,
  };
  $.ajax({
    url: "http://localhost:3010/assignment/getStudentSubmissionS",
    type: "POST",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", userToken);
    },
    async: true,
    contentType: "application/json",
    data: JSON.stringify(data),
    success: function (data, textStatus, jqXHR) {
      console.log(data);
      if (data.length > 0) {
        alert("Assignment already submitted");
        window.close();
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function checkIfAssignmentSubmitted2() {
  data = {
    assignedSId: assignedId,
    studentId: studentId,
  };
  $.ajax({
    url: "http://localhost:3010/dataSet/getStudentSubmissionS",
    type: "POST",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", userToken);
    },
    async: true,
    contentType: "application/json",
    data: JSON.stringify(data),
    success: function (data, textStatus, jqXHR) {
      console.log(data);
      if (data.length > 0) {
        alert("Assignment already submitted");
        window.close();
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function setUserType() {
  if (studentId) {
    userType = 3;
    localStorageSetItem("studentId", studentId);
  } else if (lecturerId) {
    userType = 2;
    localStorageSetItem("teacherId", lecturerId);
  }
  localStorageSetItem("userType", userType);
}

function encode(str) {
  return btoa(unescape(encodeURIComponent(str || "")));
}

function decode(bytes) {
  var escaped = escape(atob(bytes || ""));
  try {
    return decodeURIComponent(escaped);
  } catch {
    return unescape(escaped);
  }
}

function getAssignment(data) {
  timeStart = performance.now();
  console.log(data.userToken);
  $.ajax({
    url: "http://localhost:3010/assignment/getAssignmentStd",
    type: "POST",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", data.userToken);
    },
    async: true,
    contentType: "application/json",
    data: JSON.stringify(data),
    success: function (data, textStatus, jqXHR) {
      console.log(data);
      title = data[0].title;
      description = data[0].details;
      resourceLinks = data[0].resourceLinks;
      resourceLinks = resourceLinks.replace(/\s/g, "\n");
      assignment = `${title}\n\n\nAssignment Description\n${description}\n\n\nResource Links\n${resourceLinks}`;
      //setDescription(data)
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function getAssignedAssignment(data) {
  timeStart = performance.now();
  console.log(data.userToken);
  $.ajax({
    url: "http://localhost:3010/assignment/getAssignedAssignmentStd",
    type: "POST",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", data.userToken);
    },
    async: true,
    contentType: "application/json",
    data: JSON.stringify(data),
    success: function (data, textStatus, jqXHR) {
      console.log(data);
      let formatedAssignedDate = data[0].assigned.replace("T", " ").split(" ");
      let a = formatedAssignedDate[0].replace(/-/g, " ").split(" ");
      console.log(a);
      dYear = a[0];
      dMonth = a[1];
      dYear = a[2];
      let b = formatedAssignedDate[1].replace(/:/g, " ").split(" ");
      console.log(b);
      dHours = b[0];
      dMinutes = b[1];
      console.log(formatedAssignedDate);
      //setDescription(data)
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function getDataSet(data) {
  timeStart = performance.now();
  $.ajax({
    url: "http://localhost:3010/dataSet/getDataSet3",
    type: "POST",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", data.userToken);
    },
    async: true,
    contentType: "application/json",
    data: JSON.stringify(data),
    success: function (data, textStatus, jqXHR) {
      console.log(data);
      title = data[0].title;
      description = data[0].details;
      resourceLinks = data[0].resourceLinks;
      resourceLinks = resourceLinks.replace(/\s/g, "\n");
      assignment = `${title}\n\n\nAssignment Description\n${description}\n\n\nResource Links\n${resourceLinks}`;
      ifC = data[0].ifC;
      methods = data[0].methods;
      multipleClasses = data[0].multipleClasses;
      arrays = data[0].arrays;
      dowhileL = data[0].dowhileL;
      expectedAns = data[0].expectedAns;
      expectedAnsType = data[0].expectedAnsType;
      forL = data[0].forL;
      switchC = data[0].switchC;
      whileL = data[0].whileL;
      //setDescription(data)
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function getAssignedDataSet(data) {
  timeStart = performance.now();
  $.ajax({
    url: "http://localhost:3010/assignment/getAssignedDataSet2",
    type: "POST",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", data.userToken);
    },
    async: true,
    contentType: "application/json",
    data: JSON.stringify(data),
    success: function (data, textStatus, jqXHR) {
      console.log(data);
      let formatedAssignedDate = data[0].assigned.replace("T", " ").split(" ");
      let a = formatedAssignedDate[0].replace(/-/g, " ").split(" ");
      dYear = a[0];
      dMonth = a[1];
      dYear = a[2];
      let b = formatedAssignedDate[1].replace(/:/g, " ").split(" ");
      dHours = b[0];
      dMinutes = b[1];
      //setDescription(data)
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function localStorageSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (ignorable) {}
}

function localStorageGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch (ignorable) {
    return null;
  }
}

function showError(title, content) {
  $("#site-modal #title").html(title);
  $("#site-modal .content").html(content);
  $("#site-modal").modal("show");
}

function handleError(jqXHR, textStatus, errorThrown) {
  showError(
    `${jqXHR.statusText} (${jqXHR.status})`,
    `<pre>${JSON.stringify(jqXHR, null, 4)}</pre>`
  );
}

function handleRunError(jqXHR, textStatus, errorThrown) {
  handleError(jqXHR, textStatus, errorThrown);
  $runBtn.removeClass("loading");
}

function handleResult(data) {
  timeEnd = performance.now();
  console.log(
    "It took " + (timeEnd - timeStart) + " ms to get submission result."
  );
  console.log(data);
  var status = data.status;
  var stdout = decode(data.stdout);
  codeResult = stdout;
  var stderr = decode(data.stderr);
  var compile_output = decode(data.compile_output);
  if (compile_output !== null) {
    errors.push(compile_output);
    numberOfErrors = numberOfErrors + 1;
  }
  var sandbox_message = decode(data.message);
  var time = data.time === null ? "-" : data.time + "s";
  var memory = data.memory === null ? "-" : data.memory + "KB";

  $statusLine.html(`${status.description}, ${time}, ${memory}`);

  if (blinkStatusLine) {
    $statusLine.addClass("blink");
    setTimeout(function () {
      blinkStatusLine = false;
      localStorageSetItem("blink", "false");
      $statusLine.removeClass("blink");
    }, 3000);
  }

  stdoutEditor.setValue(stdout);
  stderrEditor.setValue(stderr);
  compileOutputEditor.setValue(compile_output);
  sandboxMessageEditor.setValue(sandbox_message);

  if (stdout !== "") {
    var dot = document.getElementById("stdout-dot");
    if (!dot.parentElement.classList.contains("lm_active")) {
      dot.hidden = false;
    }
  }
  if (stderr !== "") {
    var dot = document.getElementById("stderr-dot");
    if (!dot.parentElement.classList.contains("lm_active")) {
      dot.hidden = false;
    }
  }
  if (compile_output !== "") {
    var dot = document.getElementById("compile-output-dot");
    if (!dot.parentElement.classList.contains("lm_active")) {
      dot.hidden = false;
    }
  }
  if (sandbox_message !== "") {
    var dot = document.getElementById("sandbox-message-dot");
    if (!dot.parentElement.classList.contains("lm_active")) {
      dot.hidden = false;
    }
  }

  $runBtn.removeClass("loading");
}

function getIdFromURI() {
  var uri = location.search.substr(1).trim();
  return uri.split("&")[0];
}

function save() {
  var content = JSON.stringify({
    source_code: encode(sourceEditor.getValue()),
    language_id: 62,
    compiler_options: $compilerOptions.val(),
    command_line_arguments: $commandLineArguments.val(),
    stdin: encode(stdinEditor.getValue()),
    stdout: encode(stdoutEditor.getValue()),
    stderr: encode(stderrEditor.getValue()),
    compile_output: encode(compileOutputEditor.getValue()),
    sandbox_message: encode(sandboxMessageEditor.getValue()),
    status_line: encode($statusLine.html()),
  });
  var filename = "judge0-ide.json";
  var data = {
    content: content,
    filename: filename,
  };

  $.ajax({
    url: pbUrl,
    type: "POST",
    async: true,
    headers: {
      Accept: "application/json",
    },
    data: data,
    xhrFields: {
      withCredentials: true,
    },
    success: function (data, textStatus, jqXHR) {
      if (getIdFromURI() != data["short"]) {
        window.history.replaceState(
          null,
          null,
          location.origin + location.pathname + "?" + data["short"]
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      handleError(jqXHR, textStatus, errorThrown);
    },
  });
}

function downloadSource() {
  var value = 62;
  download(sourceEditor.getValue(), fileNames[value], "text/plain");
}

function run() {
  if (sourceEditor.getValue().trim() === "") {
    showError("Error", "Source code can't be empty!");
    return;
  } else {
    $runBtn.addClass("loading");
  }

  document.getElementById("stdout-dot").hidden = true;
  document.getElementById("stderr-dot").hidden = true;
  document.getElementById("compile-output-dot").hidden = true;
  document.getElementById("sandbox-message-dot").hidden = true;

  stdoutEditor.setValue("");
  stderrEditor.setValue("");
  compileOutputEditor.setValue("");
  sandboxMessageEditor.setValue("");

  var sourceValue = encode(sourceEditor.getValue());
  sourceCode = sourceEditor.getValue();
  var stdinValue = encode(stdinEditor.getValue());
  var languageId = 62;
  var compilerOptions = $compilerOptions.val();
  var commandLineArguments = $commandLineArguments.val();

  var data = {
    source_code: sourceValue,
    language_id: languageId,
    stdin: stdinValue,
    compiler_options: compilerOptions,
    command_line_arguments: commandLineArguments,
    redirect_stderr_to_stdout: redirectStderrToStdout,
  };

  var sendRequest = function (data) {
    timeStart = performance.now();
    $.ajax({
      url: apiUrl + `/submissions?base64_encoded=true&wait=${wait}`,
      type: "POST",
      async: true,
      contentType: "application/json",
      data: JSON.stringify(data),
      xhrFields: {
        withCredentials: apiUrl.indexOf("/secure") != -1 ? true : false,
      },
      success: function (data, textStatus, jqXHR) {
        // console.log(`Your submission token is: ${data.token}`);
        if (wait == true) {
          handleResult(data);
        } else {
          setTimeout(fetchSubmission.bind(null, data.token), check_timeout);
        }
      },
      error: handleRunError,
    });
  };

  var fetchAdditionalFiles = false;
  if (parseInt(languageId) === 82) {
    if (sqliteAdditionalFiles === "") {
      fetchAdditionalFiles = true;
      $.ajax({
        url: `https://minio.judge0.com/public/ide/sqliteAdditionalFiles.base64.txt?${Date.now()}`,
        type: "GET",
        async: true,
        contentType: "text/plain",
        success: function (responseData, textStatus, jqXHR) {
          sqliteAdditionalFiles = responseData;
          data["additional_files"] = sqliteAdditionalFiles;
          sendRequest(data);
        },
        error: handleRunError,
      });
    } else {
      data["additional_files"] = sqliteAdditionalFiles;
    }
  }

  if (!fetchAdditionalFiles) {
    sendRequest(data);
  }
  // getAssignment(data2)
}

function submit() {
  if (codeResult === "") {
    alert("Solution not yet found");
  } else {
    var submissionDate = new Date();
    let sDate = submissionDate.getDate();
    let sHours = submissionDate.getHours();
    let sMinutes = submissionDate.getMinutes();

    let stDate = startingDate.getDate();
    let stHours = startingDate.getHours();
    let stMinutes = startingDate.getMinutes();

    let timeTaken =
      (sDate - stDate) * 24 * 60 +
      (sHours - stHours) * 60 +
      (sMinutes - stMinutes);
    data = {
      assignedId: assignedId,
      studentId: studentId,
      solution: sourceCode,
      errorsList: errors,
      errors: numberOfErrors,
      timeTaken: timeTaken,
    };
    $.ajax({
      url: "http://localhost:3010/assignment/studentSubmission",
      type: "POST",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", userToken);
      },
      async: true,
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function (data, textStatus, jqXHR) {
        alert("submitted");
        localStorage.clear();
        window.close();
        //setDescription(data)
      },
      error: function (error) {
        console.log(error);
      },
    });
  }
}

function submit2() {
  if (codeResult === "") {
    alert("Solution not yet found");
  } else {
    var submissionDate = new Date();
    let sDate = submissionDate.getDate();
    let sHours = submissionDate.getHours();
    let sMinutes = submissionDate.getMinutes();

    let stDate = startingDate.getDate();
    let stHours = startingDate.getHours();
    let stMinutes = startingDate.getMinutes();

    let timeTaken =
      (sDate - stDate) * 24 * 60 +
      (sHours - stHours) * 60 +
      (sMinutes - stMinutes);
    data = {
      assignedSId: assignedId,
      studentId: studentId,
      solution: sourceCode,
      errorsList: errors,
      errors: numberOfErrors,
      timeTaken: timeTaken,
    };

    let formattedCode = sourceCode.replace(/\s+/g, "");
    console.log(formattedCode);

    if (ifC === 1) {
      let temp = 0;
      let temparray = [];
      let finalValue = "";
      for (let i = 0; i < formattedCode.length; i++) {
        if (temparray.length > 0 && temparray[temparray.length - 1] === '"') {
          if (formattedCode.charAt(i) === '"') {
            temparray.pop();
          }
        } else if (formattedCode.charAt(i) === '"') {
          temparray.push(formattedCode.charAt(i));
        } else if (
          temp === 0 &&
          formattedCode.charAt(i) === ifT.charAt(temp)
        ) {
          if (
            formattedCode.charAt(i - 1) === "{" ||
            formattedCode.charAt(i - 1) === "}" ||
            formattedCode.charAt(i - 1) === ";"
          ) {
            temp = temp + 1;
            temparray.push(formattedCode.charAt(i));
          }
        } else if (temp > 0 && formattedCode.charAt(i) === ifT.charAt(temp)) {
          temp = temp + 1;
          temparray.push(formattedCode.charAt(i));
        }
        if (
          formattedCode.charAt(i) === ifT.charAt(ifT.length - 1) &&
          ifT.length === temparray.length
        ) {
          console.log(temparray);
          break;
        }
      }

      for (let i = 0; i < temparray.length; i++) {
        finalValue = finalValue.concat(temparray[i]);
      }

      if (finalValue != ifT) {
        console.log(temparray);
        alert("if not found");
        return;
      } else {
        console.log(temparray);
      }
    }

    if (ifC === 2) {
      let temp = 0;
      let temparray = [];
      let finalValue = "";
      for (let i = 0; i < formattedCode.length; i++) {
        if (temparray.length > 0 && temparray[temparray.length - 1] === '"') {
          if (formattedCode.charAt(i) === '"') {
            temparray.pop();
          }
        } else if (formattedCode.charAt(i) === '"') {
          temparray.push(formattedCode.charAt(i));
        } else if (
          temp === 0 &&
          formattedCode.charAt(i) === ieiT.charAt(temp)
        ) {
          if (
            formattedCode.charAt(i - 1) === "{" ||
            formattedCode.charAt(i - 1) === "}" ||
            formattedCode.charAt(i - 1) === ";"
          ) {
            temp = temp + 1;
            temparray.push(formattedCode.charAt(i));
          }
        } else if (temp > 0 && formattedCode.charAt(i) === ieiT.charAt(temp)) {
          temp = temp + 1;
          temparray.push(formattedCode.charAt(i));
        }
        if (
          formattedCode.charAt(i) === ieiT.charAt(ieiT.length - 1) &&
          ieiT.length === temparray.length
        ) {
          console.log(temparray);
          break;
        }
      }

      for (let i = 0; i < temparray.length; i++) {
        finalValue = finalValue.concat(temparray[i]);
      }

      if (finalValue != ieiT) {
        console.log(temparray);
        alert("if else not found");
        return;
      } else {
        console.log(temparray);
      }
    }

    if (switchC === 1) {
      let temp = 0;
      let temparray = [];
      let finalValue = "";
      for (let i = 0; i < formattedCode.length; i++) {
        if (temparray.length > 0 && temparray[temparray.length - 1] === '"') {
          if (formattedCode.charAt(i) === '"') {
            temparray.pop();
          }
        } else if (formattedCode.charAt(i) === '"') {
          temparray.push(formattedCode.charAt(i));
        } else if (
          temp === 0 &&
          formattedCode.charAt(i) === switchT.charAt(temp)
        ) {
          if (
            formattedCode.charAt(i - 1) === "{" ||
            formattedCode.charAt(i - 1) === "}" ||
            formattedCode.charAt(i - 1) === ";"
          ) {
            temp = temp + 1;
            temparray.push(formattedCode.charAt(i));
          }
        } else if (temp > 0 && formattedCode.charAt(i) === switchT.charAt(temp)) {
          temp = temp + 1;
          temparray.push(formattedCode.charAt(i));
        }
        if (
          formattedCode.charAt(i) === switchT.charAt(switchT.length - 1) &&
          switchT.length === temparray.length
        ) {
          console.log(temparray);
          break;
        }
      }

      for (let i = 0; i < temparray.length; i++) {
        finalValue = finalValue.concat(temparray[i]);
      }

      if (finalValue != switchT) {
        console.log(temparray);
        alert("switch not found");
        return;
      } else {
        console.log(temparray);
      }
    }

    if (whileL === 1) {
      let temp = 0;
      let temparray = [];
      let finalValue = "";
      for (let i = 0; i < formattedCode.length; i++) {
        if (temparray.length > 0 && temparray[temparray.length - 1] === '"') {
          if (formattedCode.charAt(i) === '"') {
            temparray.pop();
          }
        } else if (formattedCode.charAt(i) === '"') {
          temparray.push(formattedCode.charAt(i));
        } else if (
          temp === 0 &&
          formattedCode.charAt(i) === whileT.charAt(temp)
        ) {
          if (
            formattedCode.charAt(i - 1) === "{" ||
            formattedCode.charAt(i - 1) === "}" ||
            formattedCode.charAt(i - 1) === ";"
          ) {
            temp = temp + 1;
            temparray.push(formattedCode.charAt(i));
          }
        } else if (temp > 0 && formattedCode.charAt(i) === whileT.charAt(temp)) {
          temp = temp + 1;
          temparray.push(formattedCode.charAt(i));
        }
        if (
          formattedCode.charAt(i) === whileT.charAt(whileT.length - 1) &&
          whileT.length === temparray.length
        ) {
          console.log(temparray);
          break;
        }
      }

      for (let i = 0; i < temparray.length; i++) {
        finalValue = finalValue.concat(temparray[i]);
      }

      if (finalValue != whileT) {
        console.log(temparray);
        alert("while not found");
        return;
      } else {
        console.log(temparray);
      }
    }

    if (dowhileL === 1) {
      let temp = 0;
      let temparray = [];
      let finalValue = "";
      for (let i = 0; i < formattedCode.length; i++) {
        if (temparray.length > 0 && temparray[temparray.length - 1] === '"') {
          if (formattedCode.charAt(i) === '"') {
            temparray.pop();
          }
        } else if (formattedCode.charAt(i) === '"') {
          temparray.push(formattedCode.charAt(i));
        } else if (
          temp === 0 &&
          formattedCode.charAt(i) === dowhileT.charAt(temp)
        ) {
          if (
            formattedCode.charAt(i - 1) === "{" ||
            formattedCode.charAt(i - 1) === "}" ||
            formattedCode.charAt(i - 1) === ";"
          ) {
            temp = temp + 1;
            temparray.push(formattedCode.charAt(i));
          }
        } else if (temp > 0 && formattedCode.charAt(i) === dowhileT.charAt(temp)) {
          temp = temp + 1;
          temparray.push(formattedCode.charAt(i));
        }
        if (
          formattedCode.charAt(i) === dowhileT.charAt(dowhileT.length - 1) &&
          dowhileT.length === temparray.length
        ) {
          console.log(temparray);
          break;
        }
      }

      for (let i = 0; i < temparray.length; i++) {
        finalValue = finalValue.concat(temparray[i]);
      }

      if (finalValue != dowhileT) {
        console.log(temparray);
        alert("do while not found");
        return;
      } else {
        console.log(temparray);
      }
    }

    if (forL === 1) {
      let temp = 0;
      let temparray = [];
      let finalValue = "";
      for (let i = 0; i < formattedCode.length; i++) {
        if (temparray.length > 0 && temparray[temparray.length - 1] === '"') {
          if (formattedCode.charAt(i) === '"') {
            temparray.pop();
          }
        } else if (formattedCode.charAt(i) === '"') {
          temparray.push(formattedCode.charAt(i));
        } else if (
          temp === 0 &&
          formattedCode.charAt(i) === forT.charAt(temp)
        ) {
          if (
            formattedCode.charAt(i - 1) === "{" ||
            formattedCode.charAt(i - 1) === "}" ||
            formattedCode.charAt(i - 1) === ";"
          ) {
            temp = temp + 1;
            temparray.push(formattedCode.charAt(i));
          }
        } else if (temp > 0 && formattedCode.charAt(i) === forT.charAt(temp)) {
          temp = temp + 1;
          temparray.push(formattedCode.charAt(i));
        }
        if (
          formattedCode.charAt(i) === forT.charAt(forT.length - 1) &&
          forT.length === temparray.length
        ) {
          console.log(temparray);
          break;
        }
      }

      for (let i = 0; i < temparray.length; i++) {
        finalValue = finalValue.concat(temparray[i]);
      }

      if (finalValue != forT) {
        console.log(temparray);
        alert("for not found");
        return;
      } else {
        console.log(temparray);
      }
    }

    if (multipleClasses === 1) {
      let temp = 0;
      let count = 0;
      let temparray = [];
      let finalValue = "";
      for (let i = 0; i < formattedCode.length; i++) {
        if (temparray.length > 0 && temparray[temparray.length - 1] === '"') {
          if (formattedCode.charAt(i) === '"') {
            temparray.pop();
          }
        } else if (formattedCode.charAt(i) === '"') {
          temparray.push(formattedCode.charAt(i));
        } else if (
          temp === 0 &&
          formattedCode.charAt(i) === classT.charAt(temp)
        ) {
          if (
            formattedCode.charAt(i + 1) === "l" &&
            formattedCode.charAt(i + 2) === "a" &&
            formattedCode.charAt(i + 3) === "s" &&
            formattedCode.charAt(i + 4) === "s" 
          ) {
            temp = temp + 1;
            temparray.push(formattedCode.charAt(i));
          }
        } else if (temp > 0 && formattedCode.charAt(i) === classT.charAt(temp)) {
          temp = temp + 1;
          temparray.push(formattedCode.charAt(i));
        }
        if (
          formattedCode.charAt(i) === classT.charAt(classT.length - 1) &&
          classT.length === temparray.length
        ) {
          console.log(temparray)
          temparray = []
          temp = 0
          count = count + 1
        }
      }
      if (count < 2 ) {
        console.log(count);
        alert("class not found");
        return;
      } else {
        console.log(temparray);
      }
    }

    if (expectedAnsType === 1) {
      let formattedAns = expectedAns.replace(/\s+/g, "");
      let formattedResult = codeResult.replace(/\s+/g, "");
      if (formattedAns != formattedResult) {
        alert('results do not match')
        return
      }
    }else if (expectedAnsType === 2) {
      console.log(typeof parseInt(2))
      console.log(typeof codeResult)
      let convertedAns = parseInt(expectedAns.replace(/\s+/g, ""))
      console.log(isNaN(expectedAns))
      if (isNaN(codeResult)) {
        alert('Please remove unnecessary string and rerun the program')
        return
      }
      let convertedResult = parseInt(codeResult.replace(/\s+/g, ""))
      if (convertedAns != convertedResult) {
        alert('Results dont match')
      }
    }else if (expectedAnsType === 3) {
      let formattedAns = expectedAns.replace(/\s+/g, "");
      let formattedResult = codeResult.replace(/\s+/g, "");
      if (formattedAns != formattedResult) {
        alert('results do not match')
        return
      }
    }

    $.ajax({
        url: "http://localhost:3010/dataSet/studentSubmission",
        type: "POST",
        beforeSend: function(xhr){xhr.setRequestHeader('Authorization',userToken);},
        async: true,
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data, textStatus, jqXHR) {
            console.log( data)
            alert("submitted")
            localStorage.clear();
            window.close();

        },
        error: function (error) {
            console.log(error)
        }
    });
  }
}

function fetchSubmission(submission_token) {
  $.ajax({
    url: apiUrl + "/submissions/" + submission_token + "?base64_encoded=true",
    type: "GET",
    async: true,
    success: function (data, textStatus, jqXHR) {
      if (data.status.id <= 2) {
        // In Queue or Processing
        setTimeout(fetchSubmission.bind(null, submission_token), check_timeout);
        return;
      }
      handleResult(data);
    },
    error: handleRunError,
  });
}

function insertTemplate() {
  currentLanguageId = 62;
  sourceEditor.setValue(sources[currentLanguageId]);
  descriptionMessageEditor.setValue(assignment);
}

function setDescription(data) {
  let title = data[0].title;
  let description = data[0].details;
  let resourceLinks = data[0].resourceLinks;
  // console.log(typeof title)

  descriptionMessageEditor.setValue("s");
}

function resizeEditor(layoutInfo) {
  if (editorMode != "normal") {
    var statusLineHeight = $("#editor-status-line").height();
    layoutInfo.height -= statusLineHeight;
    layoutInfo.contentHeight -= statusLineHeight;
  }
}

function disposeEditorModeObject() {
  try {
    editorModeObject.dispose();
    editorModeObject = null;
  } catch (ignorable) {}
}

function changeEditorMode() {
  disposeEditorModeObject();

  if (editorMode == "vim") {
    editorModeObject = MonacoVim.initVimMode(
      sourceEditor,
      $("#editor-status-line")[0]
    );
  } else if (editorMode == "emacs") {
    var statusNode = $("#editor-status-line")[0];
    editorModeObject = new MonacoEmacs.EmacsExtension(sourceEditor);
    editorModeObject.onDidMarkChange(function (e) {
      statusNode.textContent = e ? "Mark Set!" : "Mark Unset";
    });
    editorModeObject.onDidChangeKey(function (str) {
      statusNode.textContent = str;
    });
    editorModeObject.start();
  }
}

function resolveLanguageId(id) {
  id = parseInt(id);
  return 62;
}

function resolveApiUrl(id) {
  id = parseInt(id);
  return languageApiUrlTable[id] || defaultUrl;
}

function editorsUpdateFontSize(fontSize) {
  sourceEditor.updateOptions({ fontSize: fontSize });
  stdinEditor.updateOptions({ fontSize: fontSize });
  stdoutEditor.updateOptions({ fontSize: fontSize });
  stderrEditor.updateOptions({ fontSize: fontSize });
  compileOutputEditor.updateOptions({ fontSize: fontSize });
  sandboxMessageEditor.updateOptions({ fontSize: fontSize });
}

function updateScreenElements() {
  var display = window.innerWidth <= 1200 ? "none" : "";
  $(".wide.screen.only").each(function (index) {
    $(this).css("display", display);
  });
}

$(window).resize(function () {
  layout.updateSize();
  updateScreenElements();
});

$(document).ready(async function () {
  setUserType();
  verification();
  if (userType === 3) {
    if (assignmentType === "1") {
      checkIfAssignmentSubmitted();
      var data2 = {
        studentId: studentId,
        assignmentId: assignmentId,
        userToken: userToken,
      };
      var data3 = {
        assignedId: assignedId,
        userToken: userToken,
      };
      console.log(assignedId);
      getAssignment(data2);
      getAssignedAssignment(data3);
    } else if (assignmentType === "2") {
      checkIfAssignmentSubmitted2();
      var data2 = {
        datasetId: assignmentId,
        userToken: userToken,
      };
      var data3 = {
        assignedSId: assignedId,
        userToken: userToken,
      };
      console.log(assignedId);
      getDataSet(data2);
      getAssignedDataSet(data3);
    } else {
      alert("Invalid request");
      window.close();
    }
  }

  updateScreenElements();

  console.log(
    "Hey, Judge0 IDE is open-sourced: https://github.com/judge0/ide. Have fun!"
  );

  $compilerOptions = $("#compiler-options");
  $commandLineArguments = $("#command-line-arguments");
  $commandLineArguments.attr(
    "size",
    $commandLineArguments.attr("placeholder").length
  );

  $insertTemplateBtn = $("#insert-template-btn");
  $insertTemplateBtn.click(function (e) {
    if (
      isEditorDirty &&
      confirm("Are you sure? Your current changes will be lost.")
    ) {
      insertTemplate();
      //setDescription(data2)
    }
  });

  $runBtn = $("#run-btn");
  $runBtn.click(function (e) {
    run();
  });

  $submitBtn = $("#submit-btn");
  $submitBtn.click(function (e) {
    if (assignmentType === "1") {
      submit();
    } else if (assignmentType === "2") {
      submit2();
    }
  });

  $navigationMessage = $("#navigation-message span");

  $(`input[name="editor-mode"][value="${editorMode}"]`).prop("checked", true);
  $('input[name="editor-mode"]').on("change", function (e) {
    editorMode = e.target.value;
    localStorageSetItem("editorMode", editorMode);

    resizeEditor(sourceEditor.getLayoutInfo());
    changeEditorMode();

    sourceEditor.focus();
  });

  $('input[name="redirect-output"]').prop("checked", redirectStderrToStdout);
  $('input[name="redirect-output"]').on("change", function (e) {
    redirectStderrToStdout = e.target.checked;
    localStorageSetItem("redirectStderrToStdout", redirectStderrToStdout);
  });

  $statusLine = $("#status-line");

  $("body").keydown(function (e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode == 120) {
      // F9
      e.preventDefault();
      run();
    } else if (keyCode == 119) {
      // F8
      e.preventDefault();
      var url = prompt("Enter URL of Judge0 API:", apiUrl);
      if (url != null) {
        url = url.trim();
      }
      if (url != null && url != "") {
        apiUrl = url;
        localStorageSetItem("api-url", apiUrl);
      }
    } else if (keyCode == 118) {
      // F7
      e.preventDefault();
      wait = !wait;
      localStorageSetItem("wait", wait);
      alert(`Submission wait is ${wait ? "ON. Enjoy" : "OFF"}.`);
    } else if (event.ctrlKey && keyCode == 83) {
      // Ctrl+S
      e.preventDefault();
      save();
    } else if (event.ctrlKey && keyCode == 107) {
      // Ctrl++
      e.preventDefault();
      fontSize += 1;
      editorsUpdateFontSize(fontSize);
    } else if (event.ctrlKey && keyCode == 109) {
      // Ctrl+-
      e.preventDefault();
      fontSize -= 1;
      editorsUpdateFontSize(fontSize);
    }
  });

  $("select.dropdown").dropdown();
  $(".ui.dropdown").dropdown();
  $(".ui.dropdown.site-links").dropdown({ action: "hide", on: "hover" });
  $(".ui.checkbox").checkbox();
  $(".message .close").on("click", function () {
    $(this).closest(".message").transition("fade");
  });

  require([
    "vs/editor/editor.main",
    "monaco-vim",
    "monaco-emacs",
  ], function (ignorable, MVim, MEmacs) {
    layout = new GoldenLayout(layoutConfig, $("#site-content"));

    MonacoVim = MVim;
    MonacoEmacs = MEmacs;

    layout.registerComponent("source", function (container, state) {
      sourceEditor = monaco.editor.create(container.getElement()[0], {
        automaticLayout: true,
        theme: "vs-dark",
        scrollBeyondLastLine: true,
        readOnly: state.readOnly,
        language: "cpp",
        minimap: {
          enabled: false,
        },
        rulers: [80, 120],
      });

      changeEditorMode();

      sourceEditor.getModel().onDidChangeContent(function (e) {
        currentLanguageId = 62;
        isEditorDirty = sourceEditor.getValue() != sources[currentLanguageId];
      });

      sourceEditor.onDidLayoutChange(resizeEditor);
    });

    layout.registerComponent("stdin", function (container, state) {
      stdinEditor = monaco.editor.create(container.getElement()[0], {
        automaticLayout: true,
        theme: "vs-dark",
        scrollBeyondLastLine: false,
        readOnly: state.readOnly,
        language: "plaintext",
        minimap: {
          enabled: false,
        },
      });
    });

    layout.registerComponent("stdout", function (container, state) {
      stdoutEditor = monaco.editor.create(container.getElement()[0], {
        automaticLayout: true,
        theme: "vs-dark",
        scrollBeyondLastLine: false,
        readOnly: state.readOnly,
        language: "plaintext",
        minimap: {
          enabled: false,
        },
      });

      container.on("tab", function (tab) {
        tab.element.append('<span id="stdout-dot" class="dot" hidden></span>');
        tab.element.on("mousedown", function (e) {
          e.target.closest(".lm_tab").children[3].hidden = true;
        });
      });
    });

    layout.registerComponent("stderr", function (container, state) {
      stderrEditor = monaco.editor.create(container.getElement()[0], {
        automaticLayout: true,
        theme: "vs-dark",
        scrollBeyondLastLine: false,
        readOnly: state.readOnly,
        language: "plaintext",
        minimap: {
          enabled: false,
        },
      });

      container.on("tab", function (tab) {
        tab.element.append('<span id="stderr-dot" class="dot" hidden></span>');
        tab.element.on("mousedown", function (e) {
          e.target.closest(".lm_tab").children[3].hidden = true;
        });
      });
    });

    layout.registerComponent("compile output", function (container, state) {
      compileOutputEditor = monaco.editor.create(container.getElement()[0], {
        automaticLayout: true,
        theme: "vs-dark",
        scrollBeyondLastLine: false,
        readOnly: state.readOnly,
        language: "plaintext",
        minimap: {
          enabled: false,
        },
      });

      container.on("tab", function (tab) {
        tab.element.append(
          '<span id="compile-output-dot" class="dot" hidden></span>'
        );
        tab.element.on("mousedown", function (e) {
          e.target.closest(".lm_tab").children[3].hidden = true;
        });
      });
    });

    layout.registerComponent("sandbox message", function (container, state) {
      sandboxMessageEditor = monaco.editor.create(container.getElement()[0], {
        automaticLayout: true,
        theme: "vs-dark",
        scrollBeyondLastLine: false,
        readOnly: state.readOnly,
        language: "plaintext",
        minimap: {
          enabled: false,
        },
      });

      container.on("tab", function (tab) {
        tab.element.append(
          '<span id="sandbox-message-dot" class="dot" hidden></span>'
        );
        tab.element.on("mousedown", function (e) {
          e.target.closest(".lm_tab").children[3].hidden = true;
        });
      });
    });

    layout.registerComponent("description", function (container, state) {
      descriptionMessageEditor = monaco.editor.create(
        container.getElement()[0],
        {
          automaticLayout: true,
          theme: "vs-dark",
          scrollBeyondLastLine: false,
          readOnly: state.readOnly,
          language: "plaintext",
          minimap: {
            enabled: false,
          },
        }
      );
    });

    layout.on("initialised", function () {
      insertTemplate();
      $("#site-navigation").css("border-bottom", "1px solid black");
      sourceEditor.focus();
    });

    layout.init();
  });
});

var javaSource =
  '\
public class Main {\n\
    public static void main(String[] args) {\n\
        System.out.println("hello, world");\n\
    }\n\
}\n\
';

var sources = {
  62: javaSource,
};

var fileNames = {
  62: "Main.java",
};

var extraApiUrl = "https://secure.judge0.com/extra";
