'use strict';
(() => {
 const script = document.currentScript;
 const assetRoot = new URL('.', script.src);
 const embedded=JSON.parse(document.querySelector('#brand-page-data')?.textContent || '{}');
 const load = name => embedded[name] ? Promise.resolve(embedded[name]) : fetch(new URL(name, assetRoot)).then(r => {if(!r.ok) throw Error('読み込みに失敗しました');return r.json();});
 function save(text, name) {
   const blob = new Blob([text], {type:'text/plain;charset=utf-8'});
   const url = URL.createObjectURL(blob), a = document.createElement('a');
   a.href=url; a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 const intro='Lit Ship セルフブランディング / ローカル学習成果物\n制度案。正式認定・合格証ではありません。\n';
 let quizResult='', quizReviewed=false;
 const quizForm=document.querySelector('[data-quiz]');
 if(quizForm) {
  let questions;
  const submit=quizForm.querySelector('[type=submit]');submit.disabled=true;
  load('brand-quiz.json').then(q=>{questions=q;submit.disabled=false;}).catch(()=>{quizForm.querySelector('[data-quiz-status]').textContent='問題データを読み込めませんでした。ページを開き直してください。';});
  quizForm.addEventListener('change',()=>{
   quizReviewed=false;quizResult='';document.querySelectorAll('[data-workbook]').forEach(f=>f.dispatchEvent(new Event('brand-source-changed')));quizForm.querySelector('[data-quiz-download]').disabled=true;
   quizForm.querySelectorAll('[data-explain]').forEach(el=>{el.textContent='';el.className='';});
   quizForm.querySelector('[data-quiz-status]').textContent='回答を変更しました。もう一度、回答と理由を確認してください。';
  });
  quizForm.addEventListener('submit',event=>{
   event.preventDefault();if(!questions)return;
   let score=0;
   const lines=questions.map((q,i)=>{
    const answer=Number(quizForm.elements['q'+i].value),correct=answer===q.answer;if(correct)score++;
    const explanation=(correct?'正しい判断です。':'ここを見直そう。')+' '+q.why;
    const el=quizForm.querySelector('[data-explain="'+i+'"]');el.textContent=explanation;el.className='answer';
    return (i+1)+'. '+q.q+'\n回答：'+q.options[answer]+'\n正しい判断：'+q.options[q.answer]+'\n'+explanation;
   });
   quizResult='理解チェック回答時点：'+score+' / '+questions.length+'問\n'+lines.join('\n\n');
   quizReviewed=true;
   quizForm.querySelector('[data-quiz-status]').textContent=score+' / '+questions.length+'問。解説を読み、見直した内容を成果物へ残せます。正式な合否判定ではありません。';
   quizForm.querySelector('[data-quiz-download]').disabled=false;
  });
  quizForm.querySelector('[data-quiz-download]').addEventListener('click',()=>{if(quizReviewed)save(intro+quizResult,'litship-brand-understanding.txt');});
 }
 function recordsText(form){
  const parts=[];
  form.querySelectorAll('[data-record-group]').forEach(group=>{
   parts.push('\n【'+group.dataset.recordTitle+'】');
   const records=group.querySelectorAll('[data-record-list] .practice-record');
   if(!records.length)parts.push('未記入');
   records.forEach((record,i)=>{
    parts.push('記録 '+(i+1));
    record.querySelectorAll('[data-record-field]').forEach(field=>parts.push(field.dataset.recordField+'：'+(field.value.trim()||'未記入')));
   });
  });
  const totals=form.querySelector('[data-record-totals]');if(totals)parts.push('\n【画面内の記録件数】\n'+totals.textContent+'\n件数は人数・因果関係・認定の合否を表しません。');
  return parts.join('\n');
 }
 document.querySelectorAll('[data-examples]').forEach(container=>{
  container.querySelectorAll('[data-example]').forEach(button=>button.addEventListener('click',()=>{
   container.querySelectorAll('[data-example]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
   container.querySelectorAll('[data-example-panel]').forEach(panel=>panel.hidden=panel.dataset.examplePanel!==button.dataset.example);
  }));
 });
 document.querySelectorAll('[data-workbook]').forEach(form=>{
  const out=form.querySelector('[data-output]'),status=form.querySelector('[data-status]');
  const make=()=>{
   const selection=document.querySelector('#brand-level');
   const lines=[intro,form.dataset.name];
   if(selection){lines.push('確認したい段階：'+selection.options[selection.selectedIndex].text);const role=document.querySelector('#brand-guidance [data-opportunity]');if(role)lines.push(role.textContent);const claim=document.querySelector('[data-capability-claim]');if(claim)lines.push('確認対象の能力（未認定）：'+claim.textContent);}
   form.querySelectorAll('[data-label]:not(:disabled)').forEach(el=>lines.push('\n【'+el.dataset.label+'】\n'+(el.value.trim()||'未記入')));
   const records=recordsText(form);if(records)lines.push(records);
   if(quizForm)lines.push('\n【理解チェック】\n'+(quizReviewed?quizResult:'未確認（回答変更後は再確認が必要です）'));
   if(quizForm)lines.push('\n【解説を読んで見直したこと】\nここに自分の言葉で追記してください。');
   out.value=lines.join('\n');form.querySelector('[data-export-panel]')?.setAttribute('open','');form.dataset.stale='false';status.textContent='実物と使った結果を、確認用の控えにまとめました。未記入・未実践の点も確認して持ち帰ってください。';
  };
  form.addEventListener('submit',event=>{event.preventDefault();make();});
  const changed=()=>{if(out.value){form.dataset.stale='true';status.textContent='入力または段階が変わりました。「相談メモをまとめる」で更新してください。出力欄への追記は更新前にコピーしてください。';}};
  form.querySelectorAll('[data-label]').forEach(el=>el.addEventListener('input',changed));
  form.addEventListener('brand-source-changed',changed);
  form.addEventListener('input',event=>{if(event.target.matches('[data-record-field]')){changed();updateTotals();}});
  form.addEventListener('change',event=>{if(event.target.matches('[data-record-field]')){changed();updateTotals();}});
  document.querySelector('#brand-level')?.addEventListener('change',changed);

  function updateTotals(){
   const box=form.querySelector('[data-record-totals]');if(!box)return;
   const counts={'案内':0,'申込':0,'実参加':0,'紹介の成立':0,'協働開始':0,'面談実施':0,'応募':0,'選考中':0,'入社／参画開始':0,'辞退・見送り':0,'その他':0};let pending=0,incomplete=0,used=0;
   form.querySelectorAll('.practice-record').forEach(record=>{
    const values={};record.querySelectorAll('[data-record-field]').forEach(el=>values[el.dataset.recordField]=el.value.trim());
    const hasContent=Object.entries(values).some(([key,value])=>!['行動の種類','確認状況'].includes(key)&&value);
    if(!hasContent)return;used++;
    if(values['確認状況']!=='確認済み'){pending++;return;}
    if(!values['行動日']||!values['確認日']||!values['確認方法・資料']){incomplete++;return;}
    counts[values['行動の種類']]++;
   });
   box.textContent=used?Object.entries(counts).map(([k,v])=>k+'の確認記録：'+v+'件').join('\n')+'\n未確認の記録：'+pending+'件\n確認済みを選択したが日付・方法が不足：'+incomplete+'件':'未記入（確認できる行動の記録はまだありません）';
  }
  form.querySelectorAll('[data-record-group]').forEach(group=>{
   const list=group.querySelector('[data-record-list]'),template=group.querySelector('template');let removed;
   const undo=document.createElement('button');undo.type='button';undo.className='btn';undo.dataset.undoRecord='';undo.textContent='直前の削除を戻す';undo.hidden=true;group.append(undo);
   const renumber=()=>list.querySelectorAll('[data-record-number]').forEach((n,i)=>n.textContent=String(i+1));
   const add=()=>{const record=template.content.firstElementChild.cloneNode(true);list.append(record);renumber();return record;};
   group.querySelector('[data-add-record]').addEventListener('click',()=>{const record=add();changed();updateTotals();record.querySelector('input,textarea,select')?.focus();});
   group.addEventListener('click',event=>{const button=event.target.closest('[data-remove-record]');if(!button)return;const record=button.closest('.practice-record');removed={record,index:[...list.children].indexOf(record)};record.remove();renumber();undo.hidden=false;changed();updateTotals();undo.focus();});
   undo.addEventListener('click',()=>{if(!removed)return;list.insertBefore(removed.record,list.children[removed.index]||null);const record=removed.record;removed=null;undo.hidden=true;renumber();changed();updateTotals();record.querySelector('input,textarea,select')?.focus();});
   add();updateTotals();
  });

  form.querySelector('[data-download]').addEventListener('click',()=>{if(!out.value.trim()){status.textContent='先に「相談メモをまとめる」で出力してください。';return;}if(form.dataset.stale==='true'){status.textContent='入力が変わっています。成果物をまとめ直してから持ち帰ってください。';return;}save(out.value,'litship-brand-artifact.txt');status.textContent='成果物のテキストを持ち帰りました。';});
  form.querySelector('[data-copy]').addEventListener('click',async()=>{if(!out.value.trim()){status.textContent='先に「相談メモをまとめる」で出力してください。';return;}if(form.dataset.stale==='true'){status.textContent='入力が変わっています。成果物をまとめ直してから持ち帰ってください。';return;}try{await navigator.clipboard.writeText(out.value);status.textContent='コピーしました。';}catch{out.focus();out.select();status.textContent='出力を選択しました。コピー操作で持ち帰ってください。';}});
 });
 document.querySelectorAll('[data-brand-pick]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-brand-pick]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  const mission=document.querySelector('#mission-'+button.dataset.brandPick);
  const result=document.querySelector('#brand-choice-result');
  if(result&&mission)result.textContent=mission.querySelector('h3').textContent+' から読んでみよう。';
  mission?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});
 }));
 let hasUnsavedInput=false;
 document.addEventListener('input',event=>{if(event.target.closest('[data-workbook]'))hasUnsavedInput=true;});
 window.addEventListener('beforeunload',event=>{if(hasUnsavedInput){event.preventDefault();event.returnValue='';}});
 const level=document.querySelector('#brand-level');
 if(level){
  const requested=new URLSearchParams(location.search).get('level');if(['1','2','3','4','5'].includes(requested))level.value=requested;
  load('brand-stages.json').then(stages=>{
   const update=()=>{
    const index=Number(level.value)-1,s=stages[index],box=document.querySelector('#brand-guidance');box.replaceChildren();
    const h=document.createElement('h3');h.textContent=s.simple.title;box.append(h);
    for(const [label,key] of [['前提','before'],['このランクに上がる条件','condition'],['数えないもの','exclude']]){
      const row=document.createElement('p');row.textContent=label+'：'+s.promotion[key];box.append(row);
    }
    const opportunity=document.createElement('p');opportunity.dataset.opportunity='';opportunity.textContent='挑戦できること：'+s.opportunity;box.append(opportunity);
    const roleNote=document.createElement('p');roleNote.textContent=s.role_note;box.append(roleNote);
    const order=document.createElement('p');order.textContent='認定は01から順番。前提ランクの確認状況も、相談先に伝えてください。';box.append(order);
    const detail=document.querySelector('[data-consult-details]');
    if(detail){detail.hidden=index<2;detail.querySelectorAll('input,textarea,select').forEach(el=>el.disabled=index<2);
      const result=detail.querySelector('[data-label^="結果・"]');if(result){result.placeholder=index===2?'実参加・紹介・協働の事実、確認日、方法、確認した相手。未確認は未確認。':'入社／参画開始の事実と確認担当・日付・方法。面談・応募・内定と分ける。';}
      const hire=detail.querySelector('[data-label="入社／参画開始を確認した人の実人数"]');if(hire){hire.closest('label').hidden=index<3;hire.disabled=index<3;}
    }
    const privacy=document.querySelector('[data-third-party]');if(privacy)privacy.hidden=index===0;
   };update();level.addEventListener('change',update);
  }).catch(()=>{document.querySelector('#brand-guidance').textContent='段階の材料を読み込めませんでした。各教材の「実力を確かめるなら」を参照してください。';});
 }
})();

// Motion follows reading and interaction; content is visible even without animation.
(() => {
 const root=document.querySelector('.ls-rank');if(!root)return;
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 const running=new Set();
 const reveal=(element,delay=0)=>{
  if(preference.matches||typeof element.animate!=='function')return;
  const animation=element.animate([{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}],{duration:560,delay,easing:'cubic-bezier(.2,.75,.25,1)',fill:'both'});
  running.add(animation);animation.finished.then(()=>{animation.cancel();running.delete(animation);}).catch(()=>running.delete(animation));
 };
 const hero=root.querySelector('.hero');
 if(hero&&hero.getBoundingClientRect().bottom>0){
  const elements=hero.querySelectorAll('.eyebrow,h1,.lead,.actions');
  elements.forEach((element,i)=>reveal(element,i*85));
 }
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   reveal(entry.target,Number(entry.target.dataset.motionDelay||0));observer.unobserve(entry.target);
  }),{threshold:.08,rootMargin:'0px 0px -25px 0px'});
  root.querySelectorAll('.growth-heading,.rank-transition,.rank-card,.course-steps>li,.course-opportunity,.course-support,#litship-linkedin-onboarding .section-head,#litship-linkedin-onboarding .gem,#litship-linkedin-onboarding .member').forEach((element,i)=>{
   element.dataset.motionDelay=String((i%3)*55);observer.observe(element);
  });
 }
 const progress=document.createElement('div');progress.className='reading-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
 let scheduled=false;
 const update=()=>{const range=document.documentElement.scrollHeight-innerHeight;progress.style.transform='scaleX('+(range>0?Math.max(0,Math.min(1,scrollY/range)):0)+')';scheduled=false;};
 const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update);}};
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});addEventListener('load',schedule,{once:true});update();
 preference.addEventListener('change',()=>{if(preference.matches)running.forEach(animation=>animation.cancel());});
})();
