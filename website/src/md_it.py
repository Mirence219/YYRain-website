from markdown_it import MarkdownIt
from mdit_py_plugins.footnote import footnote_plugin
from mdit_py_plugins.anchors import anchors_plugin
import bleach

md_parser = (MarkdownIt("gfm-like2")
             .use(footnote_plugin)
             .use(anchors_plugin, min_level=1, max_level=6, permalink=False))
md_parser.options["html"] = True

allowed_tags = [
    # 文本块
    "br", "p", "hr",
    # 标题 h1~h6（之前漏掉了！非常关键）
    "h1", "h2", "h3", "h4", "h5", "h6",
    # 行内文字样式
    "strong", "em", "del", "code",
    # 代码块
    "pre",
    # 引用块
    "blockquote",
    # 列表
    "ul", "ol", "li",
    # 表格
    "table", "thead", "tbody", "tfoot", "tr", "td", "th",
    # 链接、图片
    "a", "img",
    # 行内换行/分段辅助
    "span"
]

allowed_attrs = {
    "a": ["href", "target", "title"],
    "img": ["src", "alt", "title", "width", "height"],
    "th": ["align"],
    "td": ["align"],
    "*": ["class", "id"]
}

def render_markdown(md_text: str) -> str:
    '''将Markdown文本转换为安全HTML文本'''
    if not md_text:
        return ""
    raw_html = md_parser.render(md_text)
    safe_html = bleach.clean(
        raw_html,
        tags=allowed_tags,
        attributes=allowed_attrs,
        strip=True
    )
    return safe_html

def extract_headings(md_text: str):
    """提取所有标题：返回列表 [ {"level":1, "title":"xxx", "id":"anchor-id"}, ... ]"""
    tokens = md_parser.parse(md_text, env={})
    headings = []
    for token in tokens:
        if token.type == "heading_open":
            # 拿到标题级别 h1 -> level=1
            level = int(token.tag[1])
            # anchors插件生成的id存在token.attrGet("id")
            heading_id = token.attrGet("id")
            # 下一个inline token就是标题内容
            inline_token = tokens[tokens.index(token)+1]
            title = inline_token.content
            headings.append({
                "level": level,
                "title": title,
                "id": heading_id
            })
    return headings