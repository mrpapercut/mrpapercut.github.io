"use strict";

/*
id: repo.id,
description: repo.description,
createDate: self.parseRepoDate(repo.created_at),
url: repo.html_url,
language: repo.language,
name: repo.name,
owner: {
	avatar: repo.owner.avatar,
	url: repo.owner.url
},
lastModified: self.parseRepoDate(repo.updated_at)
*/

module.exports = function(data) {
	var template  = '<section id="{id}">';
		template += '	<h2><a href="{url}">{name}</a><span class="language">({language})</h2>';
		template += '	<p class="description">{description}</p>';
		template += '	<p class="dates">';
		template += '		<span>Created: <strong>{createDate}</strong></span>';
		template += '		<span>Last modified: <strong>{lastModified}</strong></span>';
		template += '	</p>';
		template += '</section>';

	return Elements.from(template.substitute(data));
}