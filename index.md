---
layout: default
title: Home
---

# Welcome to My Blog

This is my personal blog, built with Jekyll and deployed via GitHub Pages.

## About

A university student learning about Docker, web development, and cloud deployment.

## Recent Posts

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      <span>{{ post.date | date: "%Y-%m-%d" }}</span>
    </li>
  {% endfor %}
</ul>
