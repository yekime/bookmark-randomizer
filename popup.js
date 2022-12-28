// Copyright 2021 Google LLC
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

function dumpBookmarks(query) {
  var bookmarkTreeNodes = chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
    $('#bookmarks').append(dumpTreeNodes(bookmarkTreeNodes, query));
  });
}

function dumpTreeNodes(bookmarkNodes, query) {
  var list = $('<ul>');
  for (var i = 0; i < bookmarkNodes.length; i++) {
    if (bookmarkNodes[i].children) {
      list.append(dumpNode(bookmarkNodes[i], query));
    }
  }
  return list;
}

function dumpTreeLeaves(bookmarkNode) {
  var list = [];
  for (var i = 0; i < bookmarkNode.children.length; i++) {
    if (bookmarkNode.children[i].url) {
      list.push(bookmarkNode.children[i]);
    }
    else {
      var subLeaves = dumpTreeLeaves(bookmarkNode.children[i]);
      if (subLeaves) {
        list = list.concat(subLeaves);
      }
    }
  }
  return list;
}

function getRandomUrl(bookmarkNodes) {
  const idx = Math.floor(Math.random() * bookmarkNodes.length);
  return bookmarkNodes[idx].url;
}

function dumpNode(bookmarkNode, query) {
  if (bookmarkNode.title) {
    if (query && !bookmarkNode.children) {
      if (String(bookmarkNode.title.toLowerCase()).indexOf(query.toLowerCase()) == -1) {
        return $('<span></span>');
      }
    }

    var anchor = $('<a>');
    anchor.attr('href', bookmarkNode.url);
    anchor.text(bookmarkNode.title);

    anchor.click(function () {
      const url = getRandomUrl(dumpTreeLeaves(bookmarkNode));
      chrome.tabs.create({ url: url });
    });
    var span = $('<span>');
    span.append(anchor)


  }
  // 
  var li = $(bookmarkNode.children ? '<li>' : '<div>').append(span);
  if (bookmarkNode.children && bookmarkNode.children.length > 0) {
    li.append(dumpTreeNodes(bookmarkNode.children, query));
  }

  return li;
}

document.addEventListener('DOMContentLoaded', function () {
  dumpBookmarks();
});
