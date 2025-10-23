Parse.ly is an analytics platform our editorial teams use to track content performance. We are building a Node.js MCP server (using Typescript), which can be ultimately built as a Docker container. The docker piece can come separately as this could potentially be open-source. It will need to expose a port for http transport.

API overview: https://docs.parse.ly/api/api-overview/
API endpoints: https://docs.parse.ly/api/api-endpoints/

These are the tools off the top of my head we'll want. Please suggest more if you think of any.

    * get all the combos of analytics (post, author, tag)
    * get referrers, by type
    * search
    * get shares/posts

Use this library to build: https://github.com/modelcontextprotocol/typescript-sdk
