#!/usr/bin/env node
import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { addCommand } from "./commands/add.js";

const program = new Command();
program.name("sym-ui").description("sym-ui CLI").version("0.0.0");
program.command("init").description("Initialize sym-ui in the current project").action(initCommand);
program
  .command("add [components...]")
  .description("Add one or more sym-ui components")
  .option("-y, --yes", "Overwrite existing files without prompt", false)
  .action(addCommand);

program.parseAsync(process.argv);
