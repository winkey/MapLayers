# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.contrib.postgres.fields


class Migration(migrations.Migration):

    dependencies = [
        ('tilecache', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='config',
            name='description',
            field=models.TextField(null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='config',
            name='extent_type',
            field=models.TextField(null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='config',
            name='file',
            field=models.TextField(null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='config',
            name='layers',
            field=django.contrib.postgres.fields.ArrayField(null=True, base_field=models.TextField(), size=None),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='config',
            name='mapfile',
            field=models.TextField(null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='config',
            name='metadata',
            field=models.TextField(null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='config',
            name='mime_type',
            field=models.TextField(null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='config',
            name='off_layers',
            field=models.TextField(null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='config',
            name='password',
            field=models.TextField(null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='config',
            name='projection',
            field=models.TextField(null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='config',
            name='tms_type',
            field=models.TextField(null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='config',
            name='units',
            field=models.TextField(null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='config',
            name='url',
            field=models.TextField(null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='config',
            name='username',
            field=models.TextField(null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='config',
            name='watermarkimage',
            field=models.TextField(null=True),
            preserve_default=True,
        ),
    ]
