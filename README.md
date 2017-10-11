# Vote Module

This project is an application based on `angular-seed`.

It is a simple Angular module, which creates a different types questionnaires.

You can download this repo and run `npm install` to install all the dependencies. After that you can change the given examples or you can create you own.

To create your own questionnaire you need to add a `vote-directive` on page and provide a path to a `*.json` file with such structure:<br>
{<br>
&nbsp;&nbsp;&nbsp;&nbsp;"question" - string - type question you are interested in<br><br>
&nbsp;&nbsp;&nbsp;&nbsp;"answers": - Array of strings - it is an array of different answer variants<br><br>
&nbsp;&nbsp;&nbsp;&nbsp;"singleSelect": - bool - this parameter specifies whether you can select one or more options<br><br>
&nbsp;&nbsp;&nbsp;&nbsp;"multipleTimesVoting": - bool - this parameter indicates whether you can vote multiple times<br><br>
&nbsp;&nbsp;&nbsp;&nbsp;"selectNothing": - bool - this parameter indicates whether it is possible to vote without choosing the answer options<br><br>
&nbsp;&nbsp;&nbsp;&nbsp;"rightAnswers": - Array of numbers - gives an array of numbers of right answers from the second parameter<br><br>
}<br>

And after that your questionnaire will be created!