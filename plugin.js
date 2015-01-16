var format = require('util').format;

module.exports = {
    init: function (client, imports) {
        const requiresAdmin = imports.admin.requiresAdmin;

        return {
            handlers: {
                '!join': requiresAdmin(function (command) {
                    if (command.args[0]) {
                        client.notice(format('PluginControl', 'Joining %s - requested by %s', command.channel, command.prefix));
                        client.join(command.args.join(' '));
                    }

                }),

                '!part': requiresAdmin(function (command) {
                    var channel;

                    if (command.args[0]) {
                        channel = command.args[0];
                    } else if (!command.isQuery) {
                        channel = command.channel;
                    } else {
                        return;
                    }

                    client.notice(format('PluginControl', 'Parting %s - requested by %s', channel, command.prefix));
                    client.part(channel);
                }),

                '!quit': requiresAdmin(function (command) {
                    client.notice(format('PluginControl', 'Quitting network - requested by %s', command.prefix));

                    var reason = command.args.join(" ");
                    if (/^\s*$/.test(reason)) {
                        reason = format("Requested by %s", command.nickname);
                    }

                    client.quit(reason);
                }),

                '!nick': requiresAdmin(function (command) {
                    if (command.args[0]) {
                        client.notice(format('PluginControl', 'Changing nickname to %s - requested by %s', command.args[0], command.prefix));
                        client.nick(command.args[0]);
                    }
                }),

                '!say': requiresAdmin(function (command) {
                    return {
                        target: command.args[0],
                        message: command.args.slice(1).join(" ")
                    };
                }),

                '!act': requiresAdmin(function (command) {
                    return {
                        target: command.args[0],
                        intent: "act",
                        message: command.args.slice(1).join(" ")
                    };
                }),

                '!ctcp': requiresAdmin(function (command) {
                    return {
                        target: command.args[0],
                        intent: "ctcp",
                        message: [command.args[1], command.args.slice(2).join(" ")]
                    };
                })
            },

            help: {
                'join': [
                    '{{!}}join <channel>',
                    ' ',
                    'Join specifed channel.',
                    'Requires admin privileges.'
                ],
                'part': [
                    '{{!}}part [<channel>]',
                    ' ',
                    'Part specified channel.',
                    'If no channel is given, parts channel message was sent in.',
                    'Requires admin privileges.'
                ],
                'quit': [
                    '{{!}}quit [<reason>]',
                    ' ',
                    'Quit from network with given reason.',
                    'Requires admin privileges.'
                ],
                'nick': [
                    '{{!}}nick <newnick>',
                    ' ',
                    'Change bot\'s nickname to the new nickname.',
                    'Requires admin privileges.'
                ],
                'say': [
                    '{{!}}say <target> <message>',
                    ' ',
                    'Say the message to the channel.',
                    'Requires admin privileges.'
                ],
                'act': [
                    '{{!}}act <target> <action>',
                    ' ',
                    'Act the action to the channel.',
                    'Requires admin privileges.'
                ],
                'ctcp': [
                    '{{!}}ctcp <target> <ctcpType> <ctcpBody>',
                    ' ',
                    'Send a CTCP of ctcpType to target with specified body.',
                    'Requires admin privileges.'
                ]
            },

            commands: ['join', 'part', 'quit', 'nick', 'say', 'act', 'ctcp']
        }
    },

    requiresRoles: ['admin']
};