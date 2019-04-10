function delClass(lnk,param,id){
	var group = _body.find('[_groupid="'+id+'"]'), sendLnk = lnk;
	if(group.length!=0){
		if(prompt('当前分类下存在子分类，\n删除后本分类及所有子分类将全部删除！\n为确保操作准确性，请输入“ok”点击确定，进行删除。') != 'ok'){
			return false;
		}
		sendLnk = false;
	}
	_del(sendLnk,param,id,function(data){
		_msg('删除成功!',1);
		group.remove();
		$(lnk).closest('dl').remove();
	});
}
$().ready(function(e) {
	window.lines=$('dl');
	lines.each(function(i){
		var cat=$(this);
		cat.children(":first").click(function(){
			var index=cat.attr("i");
			var group = cat.nextAll('div[_groupid="'+cat.attr("cid")+'"]');
			if(cat.hasClass("catShow")) {
				cat.removeClass("catShow");
				group.hide();
			}else {
				cat.addClass("catShow");
				group.show();
			}
		});
		lines.click();
	});
});