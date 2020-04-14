
var Generator = require("yeoman-generator");
const glob = require("glob");

module.exports = class extends Generator {

  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
    //this.argument("appname", { type: String, required: true });
  }

  async prompting() {
    const answers = await this.prompt([{
      type: "input",
      name: "projectname",
      message: "Your project name",
      default: this.appname
    },
    {
      type: "input",
      name: "namespace",
      message: "Namespace (In reverse DNS)",
      default: "com.mycompany.module.www"
    },
    {
      type: "input",
      name: "description",
      message: "Description"
    }
    ]).then((answers) => {
      this.destinationRoot(`${answers.projectname}`);
      this.config.set(answers);
    });
  }

  writing() {
    this.options.oneTimeConfig = this.config.getAll();
    this.options.oneTimeConfig.fullNamespace = this.options.oneTimeConfig.namespace + "." + this.options.oneTimeConfig.projectname;
    this.options.oneTimeConfig.namespacePath = this.options.oneTimeConfig.namespace + "/" + this.options.oneTimeConfig.projectname;
    if (!this.options.oneTimeConfig.OdataServer)
      this.options.oneTimeConfig.ODataServer = "";
    if (!this.options.oneTimeConfig.serverClient)
      this.options.oneTimeConfig.serverClient = "";
    if (!this.options.oneTimeConfig.userID)
      this.options.oneTimeConfig.userID = "";
    if (!this.options.oneTimeConfig.password)
      this.options.oneTimeConfig.password = "";
    if (!this.options.oneTimeConfig.ODataServiceURL)
      this.options.oneTimeConfig.ODataServiceURL = "";

    glob.sync("**", {
      cwd: this.sourceRoot(),
      nodir: true
    }).forEach((file) => {
      const sOrigin = this.templatePath(file);
      const sTarget = this.destinationPath(file.replace(/^_/, "").replace(/\/_/, "/"));
      this.fs.copyTpl(sOrigin, sTarget, this.options.oneTimeConfig);
    });

  }

  install() {
    // this.installDependencies({
    //   bower: false,
    //   npm: false
    // });
  }
};
