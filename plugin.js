var format = require("util").format;

module.exports = {
    init: function (client, imports) {
        const requiresAdmin = imports.admin.requiresAdmin;
        const requiresAdminHelp = "Requires admin privileges.";

        return {
            handlers: {
                "!join": requiresAdmin(function (command) {
                    if (command.args[0]) {
                        client.notice(format("PluginControl", "Joining %s - requested by %s", command.channel, command.prefix));
                        client.join(command.args.join(" "));
                    }

                }),

                "!part": requiresAdmin(function (command) {
                    var channel;

                    if (command.args[0]) {
                        channel = command.args[0];
                    } else if (!command.isQuery) {
                        channel = command.channel;
                    } else {
                        return;
                    }

                    client.notice(format("PluginControl", "Parting %s - requested by %s", channel, command.prefix));
                    client.part(channel);
                }),

                "!quit": requiresAdmin(function (command) {
                    client.notice(format("PluginControl", "Quitting network - requested by %s", command.prefix));

                    var reason = command.args.join(" ");
                    if (/^\s*$/.test(reason)) {
                        reason = format("Requested by %s", command.nickname);
                    }

                    client.quit(reason);
                }),

                "!nick": requiresAdmin(function (command) {
                    if (command.args[0]) {
                        client.notice(format("PluginControl", "Changing nickname to %s - requested by %s", command.args[0], command.prefix));
                        client.nick(command.args[0]);
                    }
                }),

                "!say": requiresAdmin(function (command) {
                    return {
                        target: command.args[0],
                        message: command.args.slice(1).join(" ")
                    };
                }),

                "!act": requiresAdmin(function (command) {
                    return {
                        target: command.args[0],
                        intent: "act",
                        message: command.args.slice(1).join(" ")
                    };
                }),

                "!ctcp": requiresAdmin(function (command) {
                    return {
                        target: command.args[0],
                        intent: "ctcp",
                        message: [command.args[1], command.args.slice(2).join(" ")]
                    };
                }),

                "!notice": requiresAdmin(function (command) {
                    return {
                        target: command.args[0],
                        intent: "notice",
                        message: command.args.slice(1).join(" ")
                    };
                }),

                "!mode": requiresAdmin(function (command) {
                    if (command.args.length < 2) {
                        return {
                            query: true,
                            intent: "say",
                            message: "Error: mode command sent without enought parameters."
                        };
                    } else if (command.args.length === 2) {
                        client.rawf("MODE %s %s", command.args[0], command.args[1]);
                    } else {
                        client.rawf("MODE %s :%s", command.args[0], command.args[1], command.args.slice(2).join(" "));
                    }
                })
            },

            help: {
                "join": [
                    "{{!}}join <channel>",
                    " ",
                    "Join specifed channel.",
                    requiresAdminHelp
                ],
                "part": [
                    "{{!}}part [<channel>]",
                    " ",
                    "Part specified channel.",
                    "If no channel is given, parts channel message was sent in.",
                    requiresAdminHelp
                ],
                "quit": [
                    "{{!}}quit [<reason>]",
                    " ",
                    "Quit from network with given reason.",
                    requiresAdminHelp
                ],
                "nick": [
                    "{{!}}nick <newnick>",
                    " ",
                    "Change bot\"s nickname to the new nickname.",
                    requiresAdminHelp
                ],
                "say": [
                    "{{!}}say <target> <message>",
                    " ",
                    "Send a message to the target.",
                    requiresAdminHelp
                ],
                "act": [
                    "{{!}}act <target> <action>",
                    " ",
                    "Perform the action to the target.",
                    requiresAdminHelp
                ],
                "ctcp": [
                    "{{!}}ctcp <target> <ctcpType> <ctcpBody>",
                    " ",
                    "Send a CTCP of ctcpType to target with specified body.",
                    requiresAdminHelp
                ],
                "notice": [
                    "{{!}}notice <target> <message>",
                    " ",
                    "Send a notice to the target.",
                    requiresAdminHelp
                ],
                "mode": [
                    "{{!}}mode <target> <mode changes> <parameters>",
                    " ",
                    "Perform the mode changes.",
                    "Acts like /mode in your client.",
                    requiresAdminHelp
                ]
            },

            commands: ["join", "part", "quit", "nick", "say", "act", "ctcp", "notice", "mode"]
        };
    },

    requiresRoles: ["admin"]
};
