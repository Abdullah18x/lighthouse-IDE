import React, { Component} from 'react';
import axios from 'axios'

const ls = require('local-storage')
class IDEMain extends Component {
  state={
    studentId: ls.get('studentId'),
    lecturerId: ls.get('teacherId'),
    userType: ls.get('userType'),
    token: ls.get('token'),
    title:'',
    description:'',
    links:[],
    loggedIn: true
  }

  // verification = async () => {
  //   if (this.state.token) {
  //     let returnedResult = async () =>{
  //       try {
  //           const response = await axios.post(`http://localhost:3010/verifyUserToken/validToken`,
  //           {
  //             userType: this.state.userType,
  //             token:this.state.token
  //           }
  //           );
  //           return response.data
  //         } catch (error) {
  //           console.log(error)
  //           return error
            
  //         }
  //   }
  //   let  a = await returnedResult()
  //   console.log(a)
  //   if (a.length < 1) {
  //     window.location.href='http://localhost:3005/error'
  //   }
  //   }
  // }

  // componentDidMount(){
  //   this.verification()
  // }
    render() {
        return (
            <div><div id="site-navigation" className="ui small inverted menu">
              <div id="site-header" className="header item">
                <a href="/">
                  <img id="site-icon" src="./images/logo.png" />
                </a>
              </div>
              <div className="left menu">
                <div className="ui dropdown item site-links on-hover">
                  File <i className="dropdown icon" />
                  <div className="menu">
                    <a className="item" target="_blank" href="/"><i className="file code icon" /> New File</a>
                    <div className="item" ><i className="save icon" /> Save (Ctrl + S)</div>
                    <div className="item" ><i className="download icon" /> Download</div>
                    {/* <div class="item"><i class="share icon"></i> Share</div> */}
                    <div id="insert-template-btn" className="item"><i className="file code outline icon" /> Insert template
                      for current language</div>
                  </div>
                </div>
                {/* <div className="link item"><i className="cog icon" /> Settings</div> */}
                <div style={{display:"none"}} className="item fitted borderless wide screen only">
                  <div className="ui input">
                    <input id="compiler-options" type="text" placeholder="Compiler options" />
                  </div>
                </div>
                <div style={{display:"none"}} className="item borderless wide screen only">
                  <div className="ui input">
                    <input id="command-line-arguments" type="text" placeholder="Command line arguments" />
                  </div>
                </div>
              </div>
              <div className="right menu">
              <div className="item no-left-padding borderless">
                    <button id="submit-btn" className="ui green labeled icon button"><i className="copy outline icon" />Submit (F8)</button>
                 </div>
                <div className="item no-left-padding borderless">
                    <button id="run-btn" className="ui primary labeled icon button"><i className="play icon" />Run (F9)</button>
                 </div>
               </div>
            </div>
            <div id="site-content" />
            <div id="site-modal" className="ui modal">
              <div className="header">
                <i className="close icon" />
                <span id="title" />
              </div>
              <div className="scrolling content" />
              <div className="actions">
                <div className="ui small labeled icon cancel button">
                  <i className="remove icon" />
                  Close (ESC)
                </div>
              </div>
            </div>
            <div id="site-settings" className="ui modal">
              <i className="close icon" />
              <div className="header">
                <i className="cog icon" />
                Settings
              </div>
              <div className="content">
                <div className="ui form">
                  <div className="inline fields">
                    <label>Editor Mode</label>
                    <div className="field">
                      <div className="ui radio checkbox">
                        <input type="radio" name="editor-mode" defaultValue="normal" defaultChecked="checked" />
                        <label>Normal</label>
                      </div>
                    </div>
                    <div className="field">
                      <div className="ui radio checkbox">
                        <input type="radio" name="editor-mode" defaultValue="vim" />
                        <label>Vim</label>
                      </div>
                    </div>
                    <div className="field">
                      <div className="ui radio checkbox">
                        <input type="radio" name="editor-mode" defaultValue="emacs" />
                        <label>Emacs</label>
                      </div>
                    </div>
                  </div>
                  <div className="inline field">
                    <div className="ui checkbox">
                      <input type="checkbox" name="redirect-output" />
                      <label>Redirect stderr to stdout</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
                <div id="site-footer">
                    <span>Student Assessment Platform © 2021</span>
                </div>
            </div>
          );
    }
}

export default IDEMain