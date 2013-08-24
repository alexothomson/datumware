/**
  * @(#)log.dw.js
  *
  * @author Alex Thomson
  * 
  * @license GNU General Public License version 3 (GPLv3)
  * 
  * @class dwLogger
  * 
  * @param logLevel The log level to initialize the logger with.
  *
  * A javascript logging solution that builds off of the Console API as
  * originally defined by Mozilla and expanded by Google.
  * 
  * This file is part of datumware.
  *
  * Copyright (C) 2011-2013 Alex Thomson
  *
  * This program is free software: you can redistribute it and/or modify
  * it under the terms of the GNU General Public License as published by
  * the Free Software Foundation, either version 3 of the License, or
  * (at your option) any later version.
  *
  * This program is distributed in the hope that it will be useful,
  * but WITHOUT ANY WARRANTY; without even the implied warranty of
  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  * GNU General Public License for more details.
  *
  * You should have received a copy of the GNU General Public License
  * along with this program.  If not, see <http://www.gnu.org/licenses/>.
  * 
  */
function dwLogger(logLevel){

	var levels = {
		emergency	: 0,
		alert		: 1,
		critical	: 2,
		error		: 3,
		warning		: 4,
		notice		: 5,
		info		: 6,
		debug		: 7
	};
	
	var dwLoggerAPI = [
	    {method	: 'log',		level : 'notice'},
	    {method	: 'warn',		level : 'warning'},
	    {method	: 'error',		level : 'error'},
	    {method	: 'group',		level : 'notice'},
	    {method	: 'groupEnd',	level : 'notice'},
	];
	
	var consoleAPI = [
		{method	: 'assert',		level : 'debug'},
		{method	: 'clear',		level : 'notice'},
		{method	: 'count',		level : 'debug'},
		{method	: 'debug',		level : 'debug'},
		{method	: 'dir',		level : 'debug'},
		{method	: 'dirxml',		level : 'debug'},
		{method	: 'error',		level : 'error'},
		{method	: 'exception',	level : 'error'},
		{method	: 'group',		level : 'notice'},
		{method	: 'groupCollapsed',	level : 'notice'},
		{method	: 'groupEnd',	level : 'notice'},
		{method	: 'info',		level : 'info'},
		{method	: 'log',		level : 'notice'},
		{method	: 'markTimeline',	level : 'debug'}, //Chrome Specific
		{method	: 'profile',	level : 'debug'},
		{method	: 'profileEnd',	level : 'debug'},
		{method	: 'table',		level : 'notice'},
		{method	: 'time',		level : 'debug'},
		{method	: 'timeEnd',	level : 'debug'},
		{method	: 'timeStamp',	level : 'debug'},
		{method	: 'trace',		level : 'debug'},
		{method	: 'warn',		level : 'warning'}
	];

	var statistics = {
			implemented : 0,
			crude : 0,
			failed : 0
	};
	
	var method = "";
	var level = "";
	
	for (var index = 0; index < dwLoggerAPI.length; index++){
		method = dwLoggerAPI[index]['method'];
		level = dwLoggerAPI[index]['level'];
		if(console && levels[level]<=logLevel){
			try{
				this[method] = console[ method ].bind(console);
			}
			catch(error){
				if(console[method]){
					this[method] = console[ method ];
				}
				else{
					this[method] = function(){};
				}
			}
		}
		else{
			this[method] = function(){};
		}
		method = "";
	}

	this.group("dwLogger");
	this.group("Initialization");
	
	for (var index = 0; index < consoleAPI.length; index++){
		method = consoleAPI[index]['method'];
		level = consoleAPI[index]['level'];
		if(console && levels[level]<=logLevel){
			try{
				this[method] = console[ method ].bind(console);
				this.log("Logging method '" + method + "', level '" + level + 
							"' implemented.");
				statistics['implemented']++;
			}
			catch(error){
				if(console[method]){
					this[method] = console[ method ];
					this.warn("Implementing crude method for '" + method + 
								"', level '" + level + "'.");
					statistics['crude']++;
				}
				else{
					this[method] = function(){};
					this.warn("Logging method '" + method + "', level '" + level + 
								"' does not exist in this browser." +
								" Usage will be cleanly ignored.");
					statistics['failed']++;
				}
			}
		}
		else{
			this[method] = function(){};
		}
		method = "";
	}
	this.groupEnd();
	
	logStatistics(this);
	
	this.log("dwLogger object created.");
	
	this.groupEnd();
	
	function logStatistics(dwLogger){
		dwLogger.group("Statistics");
		for ( var index in statistics){
			dwLogger.log(index + ":"+statistics[index]);
		}
		dwLogger.groupEnd();

	}
}
